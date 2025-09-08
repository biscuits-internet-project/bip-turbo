#!/usr/bin/env bun

/**
 * Script to recalculate and update song statistics for all songs
 * This includes timesPlayed, yearlyPlayData, dateFirstPlayed, dateLastPlayed
 */

import { SongRepository } from "../packages/core/src/songs/song-repository";
import { prisma } from "../packages/core/src/_shared/prisma/client";

async function updateAllSongStatistics() {
  const songRepository = new SongRepository(prisma);
  const db = prisma;

  console.log("🔄 Starting song statistics update...");

  // Get all songs that have tracks (count unique shows, not tracks)
  const songsWithTracks = await db.$queryRaw<Array<{ song_id: string; title: string; show_count: number }>>`
    SELECT DISTINCT t.song_id, s.title, COUNT(DISTINCT t.show_id) as show_count
    FROM tracks t
    JOIN songs s ON t.song_id = s.id
    GROUP BY t.song_id, s.title
    ORDER BY s.title
  `;

  console.log(`📊 Found ${songsWithTracks.length} songs with tracks`);

  let updated = 0;
  let errors = 0;

  for (const song of songsWithTracks) {
    try {
      console.log(`Updating "${song.title}" (${song.show_count} shows)...`);
      await songRepository.updateSongStatistics(song.song_id);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${song.title}:`, error);
      errors++;
    }
  }

  // Also clean up songs with no tracks
  console.log("🧹 Cleaning up songs with no tracks...");
  const result = await db.$executeRaw`
    UPDATE songs 
    SET times_played = 0, 
        date_first_played = NULL, 
        date_last_played = NULL, 
        yearly_play_data = '{}'
    WHERE id NOT IN (
      SELECT DISTINCT song_id FROM tracks WHERE song_id IS NOT NULL
    )
    AND times_played > 0
  `;
  console.log(`🧹 Reset statistics for ${result} songs with no tracks`);

  console.log(`✅ Update complete!`);
  console.log(`   Updated: ${updated} songs`);
  console.log(`   Errors: ${errors} songs`);

  process.exit(0);
}

// Run the script
updateAllSongStatistics().catch(console.error);
