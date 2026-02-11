import type { MetaFunction } from "react-router";
import { Copy, Check, ExternalLink, Sparkles, Terminal, Code2, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const meta: MetaFunction = () => {
  return [
    { title: "MCP Server - Biscuits Internet Project" },
    {
      name: "description",
      content: "Connect AI assistants to the Disco Biscuits setlist database using the Model Context Protocol (MCP).",
    },
  ];
};

const MCP_URL = "https://discobiscuits.net/mcp";

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className={`language-${language} text-content-text-secondary`}>{code}</code>
      </pre>
      <CopyButton
        text={code}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

export default function McpInfo() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 mb-5 rounded-full bg-brand-secondary/20">
          <Sparkles className="h-8 w-8 text-brand-secondary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          MCP Server
          <span className="ml-3 px-2 py-1 text-sm font-bold uppercase tracking-wide bg-brand-secondary/20 text-brand-secondary rounded">
            beta
          </span>
        </h1>
        <p className="text-xl text-content-text-secondary max-w-2xl mx-auto leading-relaxed">
          Connect your AI assistant to the Disco Biscuits setlist database using the{" "}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-secondary hover:underline"
          >
            Model Context Protocol
          </a>
          .
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <Card className="glass-content">
          <CardHeader className="pb-2">
            <Terminal className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Search Shows</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>
              Find shows by date, venue, city, or songs played.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="glass-content">
          <CardHeader className="pb-2">
            <Code2 className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Get Setlists</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>
              Retrieve complete setlists with song transitions and notes.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="glass-content">
          <CardHeader className="pb-2">
            <Zap className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Song History</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>
              Look up songs, lyrics, and performance history.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Server URL */}
      <Card className="mb-8 glass-content">
        <CardHeader className="space-y-1">
          <CardTitle>Server URL</CardTitle>
          <CardDescription>Use this URL to connect your MCP client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
            <code className="flex-1 text-brand-secondary font-mono">{MCP_URL}</code>
            <CopyButton text={MCP_URL} />
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="glass-content">
        <CardHeader className="space-y-1">
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>Choose your AI client to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="claude-code" className="w-full">
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent p-0 mb-6">
              <TabsTrigger
                value="claude-code"
                className="rounded-full px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 data-[state=active]:bg-brand-secondary data-[state=active]:text-white data-[state=active]:border-brand-secondary hover:bg-white/10 transition-colors"
              >
                Claude Code
              </TabsTrigger>
              <TabsTrigger
                value="claude-desktop"
                className="rounded-full px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 data-[state=active]:bg-brand-secondary data-[state=active]:text-white data-[state=active]:border-brand-secondary hover:bg-white/10 transition-colors"
              >
                Claude Desktop
              </TabsTrigger>
              <TabsTrigger
                value="cursor"
                className="rounded-full px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 data-[state=active]:bg-brand-secondary data-[state=active]:text-white data-[state=active]:border-brand-secondary hover:bg-white/10 transition-colors"
              >
                Cursor
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="rounded-full px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 data-[state=active]:bg-brand-secondary data-[state=active]:text-white data-[state=active]:border-brand-secondary hover:bg-white/10 transition-colors"
              >
                Other Clients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="claude-code" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Claude Code (CLI)</h3>
                <p className="text-content-text-secondary">
                  Add the MCP server using the Claude Code CLI:
                </p>
                <CodeBlock
                  code={`claude mcp add discobiscuits --transport http ${MCP_URL}`}
                  language="bash"
                />
                <p className="text-content-text-secondary mt-4">
                  Or add it to your <code className="text-brand-secondary">~/.claude.json</code> configuration:
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "discobiscuits": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`}
                />
              </div>
            </TabsContent>

            <TabsContent value="claude-desktop" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Claude Desktop App</h3>
                <p className="text-content-text-secondary">
                  Edit your Claude Desktop configuration file:
                </p>
                <ul className="text-content-text-secondary list-disc ml-6 space-y-2 my-4">
                  <li>
                    <strong>macOS:</strong>{" "}
                    <code className="text-brand-secondary text-sm">~/Library/Application Support/Claude/claude_desktop_config.json</code>
                  </li>
                  <li>
                    <strong>Windows:</strong>{" "}
                    <code className="text-brand-secondary text-sm">%APPDATA%\Claude\claude_desktop_config.json</code>
                  </li>
                </ul>
                <p className="text-content-text-secondary">Add the following configuration:</p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "discobiscuits": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`}
                />
                <p className="text-content-text-secondary mt-4">
                  Then restart Claude Desktop to enable the MCP server.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cursor" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Cursor</h3>
                <p className="text-content-text-secondary">
                  Open Cursor Settings and navigate to <strong>Features &gt; MCP Servers</strong>.
                </p>
                <p className="text-content-text-secondary">
                  Click <strong>Add Server</strong> and enter:
                </p>
                <ul className="text-content-text-secondary list-disc ml-6 space-y-2 my-4">
                  <li>
                    <strong>Name:</strong> discobiscuits
                  </li>
                  <li>
                    <strong>Type:</strong> HTTP
                  </li>
                  <li>
                    <strong>URL:</strong> <code className="text-brand-secondary">{MCP_URL}</code>
                  </li>
                </ul>
                <p className="text-content-text-secondary">
                  Alternatively, add to your <code className="text-brand-secondary">.cursor/mcp.json</code>:
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "discobiscuits": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`}
                />
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Other MCP Clients</h3>
                <p className="text-content-text-secondary">
                  The following clients also support MCP:
                </p>
                <ul className="space-y-3 text-content-text-secondary ml-4 my-4">
                  <li className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-1 text-brand-secondary flex-shrink-0" />
                    <div>
                      <a
                        href="https://www.windsurf.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline font-medium"
                      >
                        Windsurf
                      </a>
                      <span> - AI-powered IDE with MCP support</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-1 text-brand-secondary flex-shrink-0" />
                    <div>
                      <a
                        href="https://zed.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline font-medium"
                      >
                        Zed
                      </a>
                      <span> - High-performance code editor</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-1 text-brand-secondary flex-shrink-0" />
                    <div>
                      <a
                        href="https://github.com/cline/cline"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline font-medium"
                      >
                        Cline
                      </a>
                      <span> - VS Code extension for AI coding</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-1 text-brand-secondary flex-shrink-0" />
                    <div>
                      <a
                        href="https://code.visualstudio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline font-medium"
                      >
                        VS Code + GitHub Copilot
                      </a>
                      <span> - MCP support in agent mode</span>
                    </div>
                  </li>
                </ul>
                <p className="text-content-text-secondary mt-4">
                  Most clients use a similar JSON configuration format. Refer to your client's documentation for specific setup instructions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Available Tools */}
      <Card className="mt-8 glass-content">
        <CardHeader className="space-y-1">
          <CardTitle>Available Tools</CardTitle>
          <CardDescription>16 tools exposed by the MCP server</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Tools */}
            <div>
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">Search</h4>
              <div className="space-y-3">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_shows</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search for shows by venue, date, city, or songs played</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_songs</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search the song catalog by title</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_venues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search for venues by name, city, state, or country</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_segues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search for song transitions (e.g., "Basis &gt; Helicopters")</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_by_date</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search for shows by exact date, month, or year</p>
                </div>
              </div>
            </div>

            {/* Single Item Getters */}
            <div>
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">Get Details</h4>
              <div className="space-y-3">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_setlist</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get full setlist for a show with all sets, songs, and transitions</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get song details including lyrics and play history</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song_statistics</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get detailed stats: yearly play counts, gaps between plays</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song_performances</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get all performances of a song with venue and rating info</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_venue_history</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get show history at a specific venue</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_shows_by_year</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get all shows from a specific year</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_trending_songs</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get songs most played in recent shows</p>
                </div>
              </div>
            </div>

            {/* Batch Getters */}
            <div>
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">Batch Operations</h4>
              <div className="space-y-3">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_setlists</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get setlists for multiple shows at once</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_shows</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get detailed info for multiple shows</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_songs</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get detailed info for multiple songs</p>
                </div>
                <div>
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_venues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get detailed info for multiple venues</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Usage */}
      <Card className="mt-8 mb-8 glass-content">
        <CardHeader className="space-y-1">
          <CardTitle>Example Queries</CardTitle>
          <CardDescription>Try asking your AI assistant these questions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-content-text-secondary ml-2">
            <li className="flex items-start gap-3">
              <span className="text-brand-secondary font-mono">&gt;</span>
              <span>"Search for Disco Biscuits shows at Red Rocks"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-secondary font-mono">&gt;</span>
              <span>"What's the setlist for the show on 12/31/1999?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-secondary font-mono">&gt;</span>
              <span>"Find all shows where Basis for a Day was played"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-secondary font-mono">&gt;</span>
              <span>"Tell me about the song Helicopters and show me the lyrics"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-secondary font-mono">&gt;</span>
              <span>"Search for venues in Philadelphia"</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
