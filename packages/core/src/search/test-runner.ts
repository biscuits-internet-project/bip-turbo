#!/usr/bin/env bun

// Type declarations for Bun environment
declare global {
  var Bun:
    | {
        write(file: string, data: string): Promise<number>;
      }
    | undefined;

  interface ImportMeta {
    main?: boolean;
  }
}

import { PrismaClient } from "@prisma/client";
import { PostgresSearchService } from "./postgres-search-service";
import { testLogger as logger } from "../_shared/test-logger";
import type { SearchResult } from "@bip/domain";

interface TestCase {
  query: string;
  expectedType: "Shows" | "Songs" | "Venues";
  expectedCountMin: number;
  expectedCountMax: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  notes: string;
  category: string;
}

interface TestResult {
  testCase: TestCase;
  searchResults: SearchResult[];
  expectedResults: DatabaseResult[];
  passed: boolean;
  issues: string[];
  searchTimeMs: number;
  dbTimeMs: number;
}

interface DatabaseResult {
  id: string;
  type: "show" | "song" | "venue";
  displayName: string;
  date?: string;
  venue?: string;
  relevanceScore: number;
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  criticalPassed: number;
  criticalTotal: number;
  criticalPassRate: number;
  avgSearchTime: number;
  avgDbTime: number;
  failedCases: TestCase[];
}

export class SearchTestRunner {
  private db: PrismaClient;
  private searchService: PostgresSearchService;

  constructor() {
    this.db = new PrismaClient();
    this.searchService = new PostgresSearchService(this.db, logger);
  }

  async runAllTests(): Promise<TestSummary> {
    logger.info("🚀 Starting comprehensive search test suite");

    const testCases = this.getTestCases();
    const results: TestResult[] = [];

    let passed = 0;
    let criticalPassed = 0;
    let criticalTotal = 0;
    let totalSearchTime = 0;
    let totalDbTime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      logger.info(`\n📊 Test ${i + 1}/${testCases.length}: "${testCase.query}" (${testCase.priority})`);

      const result = await this.runSingleTest(testCase);
      results.push(result);

      if (result.passed) passed++;
      if (testCase.priority === "Critical") {
        criticalTotal++;
        if (result.passed) criticalPassed++;
      }

      totalSearchTime += result.searchTimeMs;
      totalDbTime += result.dbTimeMs;

      // Log result
      if (result.passed) {
        logger.info(
          `✅ PASS - Found ${result.searchResults.length} results (expected ${testCase.expectedCountMin}-${testCase.expectedCountMax})`,
        );
      } else {
        logger.warn(`❌ FAIL - ${result.issues.join(", ")}`);
        logger.warn(`   Search: ${result.searchResults.length} results`);
        logger.warn(`   Expected: ${result.expectedResults.length} results from DB`);
      }
    }

    const summary: TestSummary = {
      totalTests: testCases.length,
      passedTests: passed,
      failedTests: testCases.length - passed,
      passRate: (passed / testCases.length) * 100,
      criticalPassed,
      criticalTotal,
      criticalPassRate: criticalTotal > 0 ? (criticalPassed / criticalTotal) * 100 : 0,
      avgSearchTime: totalSearchTime / testCases.length,
      avgDbTime: totalDbTime / testCases.length,
      failedCases: results.filter((r) => !r.passed).map((r) => r.testCase),
    };

    this.logSummary(summary);
    return summary;
  }

  private async runSingleTest(testCase: TestCase): Promise<TestResult> {
    const issues: string[] = [];

    try {
      // Execute search
      const searchStart = Date.now();
      const searchResponse = await this.searchService.search(testCase.query, { limit: 50 });
      const searchResults = searchResponse.results;
      const searchTimeMs = Date.now() - searchStart;

      // Get expected results from database
      const dbStart = Date.now();
      const expectedResults = await this.getExpectedResults(testCase);
      const dbTimeMs = Date.now() - dbStart;

      // Validate result count
      const actualCount = searchResults.length;
      if (actualCount < testCase.expectedCountMin) {
        issues.push(`Too few results: ${actualCount} < ${testCase.expectedCountMin}`);
      }
      if (actualCount > testCase.expectedCountMax) {
        issues.push(`Too many results: ${actualCount} > ${testCase.expectedCountMax}`);
      }

      // Validate result relevance (check if top results match expected results)
      const relevanceIssues = this.validateRelevance(searchResults, expectedResults, testCase);
      issues.push(...relevanceIssues);

      return {
        testCase,
        searchResults,
        expectedResults,
        passed: issues.length === 0,
        issues,
        searchTimeMs,
        dbTimeMs,
      };
    } catch (error) {
      logger.error(`Test failed for "${testCase.query}"`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        testCase,
        searchResults: [],
        expectedResults: [],
        passed: false,
        issues: [`Test execution failed: ${error instanceof Error ? error.message : String(error)}`],
        searchTimeMs: 0,
        dbTimeMs: 0,
      };
    }
  }

  private async getExpectedResults(testCase: TestCase): Promise<DatabaseResult[]> {
    const query = testCase.query.toLowerCase().trim();

    // Parse query to identify components
    const hasSegue = query.includes(">");
    const datePatterns = [
      /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/, // 12/30/99, 12/30/1999
      /\b(\d{4})\b/, // 1999
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{2,4})\b/i, // Dec 99, Dec 1999
    ];

    let hasDate = false;
    let year: number | null = null;
    let month: number | null = null;
    let day: number | null = null;

    // Extract date info
    for (const pattern of datePatterns) {
      const match = query.match(pattern);
      if (match) {
        hasDate = true;
        if (pattern === datePatterns[0]) {
          // MM/DD/YY format
          month = Number.parseInt(match[1], 10);
          day = Number.parseInt(match[2], 10);
          year = Number.parseInt(match[3], 10);
          if (year < 100) year += year < 50 ? 2000 : 1900;
        } else if (pattern === datePatterns[1]) {
          // YYYY format
          year = Number.parseInt(match[1], 10);
        } else if (pattern === datePatterns[2]) {
          // Mon YYYY format
          const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          month = monthNames.indexOf(match[1].toLowerCase()) + 1;
          year = Number.parseInt(match[2], 10);
          if (year < 100) year += year < 50 ? 2000 : 1900;
        }
        break;
      }
    }

    // Extract venue/location info
    const venues = ["wetlands", "fillmore", "coliseum", "theater"];
    const cities = ["boston", "new york", "ny", "las vegas", "amsterdam"];
    const states = ["ma", "massachusetts", "new jersey"];

    const venueTerms: string[] = [];
    for (const venue of venues) {
      if (query.includes(venue)) venueTerms.push(venue);
    }
    for (const city of cities) {
      if (query.includes(city)) venueTerms.push(city);
    }
    for (const state of states) {
      if (query.includes(state)) venueTerms.push(state);
    }

    // Extract song info
    const songs = ["shimmy", "basis", "lunar", "house dog", "little shimmy"];
    const songTerms: string[] = [];
    for (const song of songs) {
      if (query.includes(song)) songTerms.push(song);
    }

    if (hasSegue) {
      return this.getExpectedSegueResults(query, hasDate, year, month, day, venueTerms);
    } else {
      return this.getExpectedEntityResults(query, hasDate, year, month, day, venueTerms, songTerms);
    }
  }

  private async getExpectedSegueResults(
    query: string,
    hasDate: boolean,
    year: number | null,
    month: number | null,
    day: number | null,
    venueTerms: string[],
  ): Promise<DatabaseResult[]> {
    const seguePattern = query.replace(/\s*>\s*/g, " > ").trim();

    let sql = `
      SELECT DISTINCT 
        s.id,
        s.date::text as date,
        v.name as venue_name,
        sr.sequence,
        100 as relevance_score
      FROM segue_runs sr
      JOIN shows s ON sr.show_id = s.id
      LEFT JOIN venues v ON s.venue_id = v.id
      WHERE LOWER(sr.sequence) LIKE $1
    `;

    const params: (string | number)[] = [`%${seguePattern.toLowerCase()}%`];
    let paramIndex = 2;

    // Add date filters
    if (hasDate) {
      if (year && month && day) {
        sql += ` AND s.date = $${paramIndex}`;
        params.push(new Date(year, month - 1, day).toISOString().split("T")[0]);
        paramIndex++;
      } else if (year && month) {
        sql += ` AND EXTRACT(YEAR FROM s.date::timestamp) = $${paramIndex} AND EXTRACT(MONTH FROM s.date::timestamp) = $${paramIndex + 1}`;
        params.push(year, month);
        paramIndex += 2;
      } else if (year) {
        sql += ` AND EXTRACT(YEAR FROM s.date::timestamp) = $${paramIndex}`;
        params.push(year);
        paramIndex++;
      }
    }

    // Add venue filters
    if (venueTerms.length > 0) {
      const venueConditions = venueTerms
        .map(() => `(LOWER(v.name) LIKE $${paramIndex++} OR LOWER(v.city) LIKE $${paramIndex - 1})`)
        .join(" OR ");
      sql += ` AND (${venueConditions})`;
      venueTerms.forEach((term) => {
        params.push(`%${term}%`);
      });
    }

    sql += ` ORDER BY 5 DESC, 2 DESC LIMIT 50`;

    const results = await this.db.$queryRawUnsafe<Record<string, unknown>[]>(sql, ...params);

    return results.map((row) => ({
      id: row.id as string,
      type: "show" as const,
      displayName: `${row.date} • ${row.venue_name || "Unknown Venue"}`,
      date: row.date as string,
      venue: row.venue_name as string,
      relevanceScore: row.relevance_score as number,
    }));
  }

  private async getExpectedEntityResults(
    query: string,
    hasDate: boolean,
    year: number | null,
    month: number | null,
    day: number | null,
    venueTerms: string[],
    songTerms: string[],
  ): Promise<DatabaseResult[]> {
    // Build query based on what we're searching for
    if (songTerms.length > 0 || hasDate || venueTerms.length > 0) {
      // Complex show search
      let sql = `
        SELECT DISTINCT 
          s.id,
          s.date::text as date,
          v.name as venue_name,
          v.city as venue_city,
          v.state as venue_state,
          90 as relevance_score
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
      `;

      const conditions: string[] = [];
      const params: (string | number)[] = [];
      let paramIndex = 1;

      // Add song conditions
      if (songTerms.length > 0) {
        sql += `
          JOIN tracks t ON s.id = t.show_id
          JOIN songs so ON t.song_id = so.id
        `;

        const songConditions = songTerms.map(() => `LOWER(so.title) LIKE $${paramIndex++}`).join(" OR ");
        conditions.push(`(${songConditions})`);
        songTerms.forEach((term) => {
          params.push(`%${term}%`);
        });
      }

      // Add date conditions
      if (hasDate) {
        if (year && month && day) {
          conditions.push(`s.date = $${paramIndex}`);
          params.push(new Date(year, month - 1, day).toISOString().split("T")[0]);
          paramIndex++;
        } else if (year && month) {
          conditions.push(
            `EXTRACT(YEAR FROM s.date::timestamp) = $${paramIndex} AND EXTRACT(MONTH FROM s.date::timestamp) = $${paramIndex + 1}`,
          );
          params.push(year, month);
          paramIndex += 2;
        } else if (year) {
          conditions.push(`EXTRACT(YEAR FROM s.date::timestamp) = $${paramIndex}`);
          params.push(year);
          paramIndex++;
        }
      }

      // Add venue conditions
      if (venueTerms.length > 0) {
        const venueConditions = venueTerms
          .map(
            () =>
              `(LOWER(v.name) LIKE $${paramIndex++} OR LOWER(v.city) LIKE $${paramIndex - 1} OR LOWER(v.state) LIKE $${paramIndex - 1})`,
          )
          .join(" OR ");
        conditions.push(`(${venueConditions})`);
        venueTerms.forEach((term) => {
          params.push(`%${term}%`);
        });
      }

      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      }

      sql += ` ORDER BY 6 DESC, 2 DESC LIMIT 50`;

      const results = await this.db.$queryRawUnsafe<Record<string, unknown>[]>(sql, ...params);

      return results.map((row) => ({
        id: row.id as string,
        type: "show" as const,
        displayName: `${row.date} • ${row.venue_name || "Unknown Venue"}`,
        date: row.date as string,
        venue: row.venue_name as string,
        relevanceScore: row.relevance_score as number,
      }));
    } else {
      // Simple term search - could be venue, song, or general
      const results = await this.db.show.findMany({
        take: 50,
        include: {
          venue: true,
          tracks: {
            include: {
              song: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      // Filter results that match the query
      const filtered = results.filter((show) => {
        const searchText = [
          show.venue?.name,
          show.venue?.city,
          show.venue?.state,
          ...show.tracks.map((t) => t.song.title),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchText.includes(query);
      });

      return filtered.map((show) => ({
        id: show.id,
        type: "show" as const,
        displayName: `${typeof show.date === "string" ? show.date : new Date(show.date).toISOString().split("T")[0]} • ${show.venue?.name || "Unknown Venue"}`,
        date: typeof show.date === "string" ? show.date : new Date(show.date).toISOString().split("T")[0],
        venue: show.venue?.name || undefined,
        relevanceScore: 80,
      }));
    }
  }

  private validateRelevance(
    searchResults: SearchResult[],
    expectedResults: DatabaseResult[],
    testCase: TestCase,
  ): string[] {
    const issues: string[] = [];

    if (expectedResults.length === 0 && searchResults.length === 0) {
      return issues; // Both empty, that's fine
    }

    if (expectedResults.length > 0 && searchResults.length === 0) {
      issues.push("Search returned no results but database has matching records");
      return issues;
    }

    // Check if top search results appear in expected results
    const expectedIds = new Set(expectedResults.map((r) => r.id));
    const topResults = searchResults.slice(0, Math.min(5, expectedResults.length));

    let matchCount = 0;
    for (const result of topResults) {
      if (expectedIds.has(result.entityId)) {
        matchCount++;
      }
    }

    const matchRate = topResults.length > 0 ? (matchCount / topResults.length) * 100 : 0;
    if (matchRate < 50 && testCase.priority === "Critical") {
      issues.push(`Low relevance: only ${matchCount}/${topResults.length} top results match expected`);
    }

    return issues;
  }

  private logSummary(summary: TestSummary) {
    logger.info(`\n${"=".repeat(80)}`);
    logger.info("🏁 TEST SUMMARY");
    logger.info("=".repeat(80));
    logger.info(`📊 Total Tests: ${summary.totalTests}`);
    logger.info(`✅ Passed: ${summary.passedTests} (${summary.passRate.toFixed(1)}%)`);
    logger.info(`❌ Failed: ${summary.failedTests}`);
    logger.info(
      `🔥 Critical Pass Rate: ${summary.criticalPassed}/${summary.criticalTotal} (${summary.criticalPassRate.toFixed(1)}%)`,
    );
    logger.info(`⚡ Avg Search Time: ${summary.avgSearchTime.toFixed(1)}ms`);
    logger.info(`🗃️  Avg DB Time: ${summary.avgDbTime.toFixed(1)}ms`);

    if (summary.failedCases.length > 0) {
      logger.warn("\n❌ FAILED TEST CASES:");
      summary.failedCases.forEach((testCase) => {
        logger.warn(`   "${testCase.query}" (${testCase.priority}) - ${testCase.notes}`);
      });
    }

    logger.info(`\n${"=".repeat(80)}`);
  }

  private getTestCases(): TestCase[] {
    // This is a subset of the test matrix for now - we can load from file later
    return [
      // Critical Date Tests
      {
        query: "12/30/99",
        expectedType: "Shows",
        expectedCountMin: 1,
        expectedCountMax: 3,
        priority: "Critical",
        notes: "Should find 12/30/1999 shows",
        category: "Date Searches",
      },
      {
        query: "1999",
        expectedType: "Shows",
        expectedCountMin: 50,
        expectedCountMax: 200,
        priority: "High",
        notes: "All shows in 1999",
        category: "Date Searches",
      },

      // Critical Song Tests
      {
        query: "Lunar Pursuit",
        expectedType: "Shows",
        expectedCountMin: 5,
        expectedCountMax: 25,
        priority: "Critical",
        notes: "This was failing - exact song match",
        category: "Song Searches",
      },
      {
        query: "Little Shimmy in a Conga Line",
        expectedType: "Shows",
        expectedCountMin: 15,
        expectedCountMax: 80,
        priority: "Critical",
        notes: "Exact song title match",
        category: "Song Searches",
      },
      {
        query: "Shimmy",
        expectedType: "Shows",
        expectedCountMin: 20,
        expectedCountMax: 100,
        priority: "Critical",
        notes: "Shows with any Shimmy song",
        category: "Song Searches",
      },

      // Critical Venue Tests
      {
        query: "Wetlands",
        expectedType: "Shows",
        expectedCountMin: 20,
        expectedCountMax: 80,
        priority: "Critical",
        notes: "Famous venue",
        category: "Venue Searches",
      },
      {
        query: "New York",
        expectedType: "Shows",
        expectedCountMin: 50,
        expectedCountMax: 200,
        priority: "Critical",
        notes: "New York shows",
        category: "Venue Searches",
      },
      {
        query: "Boston",
        expectedType: "Shows",
        expectedCountMin: 20,
        expectedCountMax: 80,
        priority: "Critical",
        notes: "Boston shows",
        category: "Venue Searches",
      },

      // Critical Combined Tests
      {
        query: "1999 Shimmy",
        expectedType: "Shows",
        expectedCountMin: 5,
        expectedCountMax: 30,
        priority: "Critical",
        notes: "Shows in 1999 with Shimmy",
        category: "Combined Searches",
      },
      {
        query: "Wetlands House Dog",
        expectedType: "Shows",
        expectedCountMin: 1,
        expectedCountMax: 8,
        priority: "Critical",
        notes: "Venue + song",
        category: "Combined Searches",
      },
      {
        query: "New York Basis",
        expectedType: "Shows",
        expectedCountMin: 5,
        expectedCountMax: 25,
        priority: "Critical",
        notes: "City + song",
        category: "Combined Searches",
      },

      // Critical Segue Tests
      {
        query: "Shimmy > Basis",
        expectedType: "Shows",
        expectedCountMin: 3,
        expectedCountMax: 15,
        priority: "Critical",
        notes: "Basic segue search",
        category: "Segue Searches",
      },
      {
        query: "Little Shimmy in a Conga Line > Basis",
        expectedType: "Shows",
        expectedCountMin: 2,
        expectedCountMax: 10,
        priority: "Critical",
        notes: "Full song name segue",
        category: "Segue Searches",
      },

      // Edge Cases
      {
        query: "shimmy",
        expectedType: "Shows",
        expectedCountMin: 20,
        expectedCountMax: 100,
        priority: "High",
        notes: "Case insensitive",
        category: "Edge Cases",
      },
      {
        query: "XYZ123NonexistentSong",
        expectedType: "Shows",
        expectedCountMin: 0,
        expectedCountMax: 0,
        priority: "Medium",
        notes: "Should return no results",
        category: "Negative Tests",
      },
    ];
  }

  async cleanup() {
    await this.db.$disconnect();
  }
}

// Main execution
async function main() {
  const runner = new SearchTestRunner();

  try {
    const summary = await runner.runAllTests();

    // Save results to file
    const resultsFile = `/tmp/search-test-results-${Date.now()}.json`;
    if (typeof Bun !== "undefined" && Bun) {
      await Bun.write(resultsFile, JSON.stringify(summary, null, 2));
    } else {
      // Fallback for non-Bun environments
      const fs = await import("node:fs/promises");
      await fs.writeFile(resultsFile, JSON.stringify(summary, null, 2));
    }
    logger.info(`📄 Full results saved to: ${resultsFile}`);

    // Exit with appropriate code
    process.exit(summary.criticalPassRate < 80 ? 1 : 0);
  } catch (error) {
    logger.error("❌ Test suite failed", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  } finally {
    await runner.cleanup();
  }
}

// Check if this file is being run directly (Bun-specific)
if (typeof import.meta !== "undefined" && "main" in import.meta && import.meta.main) {
  main();
}
