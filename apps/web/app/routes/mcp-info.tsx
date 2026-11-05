import { Check, Code2, Copy, ExternalLink, Sparkles, Terminal, Zap } from "lucide-react";
import { useState } from "react";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { ContactDialog } from "~/components/contact/contact-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { RATE_LIMIT_DEFAULTS } from "~/lib/rate-limit-defaults";

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

const OTHER_CLIENTS = [
  {
    name: "VS Code",
    href: "https://code.visualstudio.com/docs/agents/reference/mcp-configuration",
    note: 'use "servers" as the top-level key, with "type": "http"',
  },
  {
    name: "Zed",
    href: "https://zed.dev/docs/ai/mcp",
    note: 'goes under "context_servers"; prompts you to sign in when there\'s no Authorization header',
  },
  {
    name: "Cline",
    href: "https://docs.cline.bot/mcp/configuring-mcp-servers",
    note: 'set "type": "streamableHttp"',
  },
];

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className={className}>
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
      <CopyButton text={code} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <Card variant="panel">
          <CardHeader className="pb-2">
            <Terminal className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Search Shows</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Find shows by date, venue, city, or songs played.</CardDescription>
          </CardContent>
        </Card>
        <Card variant="panel">
          <CardHeader className="pb-2">
            <Code2 className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Get Setlists</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Retrieve complete setlists with song transitions and notes.</CardDescription>
          </CardContent>
        </Card>
        <Card variant="panel">
          <CardHeader className="pb-2">
            <Zap className="h-6 w-6 text-brand-primary mb-2" />
            <CardTitle className="text-lg">Song History</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Look up songs, lyrics, and performance history.</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Server URL */}
      <Card variant="panel" className="mb-8">
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

      {/* Signing in */}
      <Card variant="panel" className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle>Signing in</CardTitle>
          <CardDescription>Use your discobiscuits.net account, through your AI app or with an API key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-content-text-secondary">
          <p>
            <strong>In an AI app:</strong> when the app asks you to sign in, it opens a browser window. Log in and click{" "}
            <strong>Authorize</strong>, and the app takes it from there. You don't need an API key for this. Don't have
            an account?{" "}
            <Link to="/auth/register" className="text-brand-secondary hover:underline">
              Sign up
            </Link>
            .
          </p>
          <p>
            <strong>With an API key:</strong> for scripts, services, and apps you'd rather not sign in through a
            browser. Create a key under Settings on{" "}
            <Link to="/profile" className="text-brand-secondary hover:underline">
              your profile
            </Link>
            . It acts as you, so keep it out of anything you share or commit. Each client's setup below shows where it
            goes.
          </p>
          <p>From a script:</p>
          <CodeBlock
            code={`curl ${MCP_URL} \\
  -H "Authorization: Bearer $DISCOBISCUITS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}
            language="bash"
          />
          <p>
            Each signed-in app or key gets {RATE_LIMIT_DEFAULTS.mcp} requests a minute. Need more for a project? Use an
            API key and{" "}
            <ContactDialog>
              <button type="button" className="text-brand-secondary hover:underline">
                get in touch
              </button>
            </ContactDialog>{" "}
            and we'll raise its limit.
          </p>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card variant="panel">
        <CardHeader className="space-y-1">
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>Choose your AI client to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="claude-code" className="w-full">
            <TabsList className="flex overflow-x-auto mb-6">
              <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
              <TabsTrigger value="claude-desktop">Claude Desktop</TabsTrigger>
              <TabsTrigger value="cursor">Cursor</TabsTrigger>
              <TabsTrigger value="other">Other Clients</TabsTrigger>
            </TabsList>

            <TabsContent value="claude-code" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Claude Code (CLI)</h3>
                <p className="text-content-text-secondary">
                  Add the server. Include <code className="text-brand-secondary">--scope user</code> to use it in every
                  project:
                </p>
                <CodeBlock code={`claude mcp add --transport http discobiscuits ${MCP_URL}`} language="bash" />
                <p className="text-content-text-secondary">
                  If it shows as needing authentication, run <code className="text-brand-secondary">/mcp</code> in
                  Claude Code and choose <strong>discobiscuits</strong> to sign in.
                </p>
                <p className="text-content-text-secondary mt-4">To use an API key instead:</p>
                <CodeBlock
                  code={`claude mcp add --transport http discobiscuits ${MCP_URL} \\
  --header "Authorization: Bearer $DISCOBISCUITS_API_KEY"`}
                  language="bash"
                />
              </div>
            </TabsContent>

            <TabsContent value="claude-desktop" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Claude Desktop and claude.ai</h3>
                <p className="text-content-text-secondary">Add it as a custom connector:</p>
                <ol className="text-content-text-secondary list-decimal ml-6 space-y-2 my-4">
                  <li>
                    Go to <strong>Customize &gt; Connectors</strong>.
                  </li>
                  <li>
                    Click <strong>+ Add</strong>, then <strong>Add custom connector</strong>.
                  </li>
                  <li>
                    Name it <strong>discobiscuits</strong>, enter{" "}
                    <code className="text-brand-secondary">{MCP_URL}</code>, and continue.
                  </li>
                  <li>
                    Choose how to sign in under <strong>Authentication</strong>, then click <strong>Add</strong>.
                  </li>
                </ol>
                <p className="text-content-text-secondary">
                  To use an API key instead, choose <strong>No sign in</strong> and add a{" "}
                  <code className="text-brand-secondary">Authorization: Bearer YOUR_API_KEY</code> entry under{" "}
                  <strong>Request headers</strong>.
                </p>
                <p className="text-content-text-secondary">
                  On a Team or Enterprise plan, an owner adds the connector in{" "}
                  <strong>Organization settings &gt; Connectors</strong>, and members click <strong>Connect</strong>{" "}
                  under <strong>Customize &gt; Connectors</strong>. Free plans are limited to one custom connector. See{" "}
                  <a
                    href="https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-secondary hover:underline"
                  >
                    Anthropic's guide
                  </a>
                  .
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cursor" className="space-y-4">
              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-content-text-primary">Cursor</h3>
                <p className="text-content-text-secondary">
                  Add this to <code className="text-brand-secondary">~/.cursor/mcp.json</code> to use it everywhere, or{" "}
                  <code className="text-brand-secondary">.cursor/mcp.json</code> for one project:
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "discobiscuits": {
      "url": "${MCP_URL}"
    }
  }
}`}
                />
                <p className="text-content-text-secondary">
                  You can turn the server on or off from <strong>Customize</strong> in the sidebar.
                </p>
                <p className="text-content-text-secondary mt-4">
                  To use an API key instead, add a header that reads it from your environment:
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "discobiscuits": {
      "url": "${MCP_URL}",
      "headers": {
        "Authorization": "Bearer \${env:DISCOBISCUITS_API_KEY}"
      }
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
                  Add <code className="text-brand-secondary">{MCP_URL}</code> as a remote HTTP server. To use an API
                  key, send it as an <code className="text-brand-secondary">Authorization: Bearer</code> header. The
                  format differs by client, so check its docs:
                </p>
                <ul className="space-y-3 text-content-text-secondary ml-4 my-4">
                  {OTHER_CLIENTS.map((client) => (
                    <li key={client.name} className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 mt-1 text-brand-secondary flex-shrink-0" />
                      <div>
                        <a
                          href={client.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-secondary hover:underline font-medium"
                        >
                          {client.name}
                        </a>
                        <span> - {client.note}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Available Tools */}
      <Card variant="panel" className="mt-8">
        <CardHeader className="space-y-1">
          <CardTitle>Available Tools</CardTitle>
          <CardDescription>17 tools exposed by the MCP server</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Tools */}
            <div>
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">Search</h4>
              <div className="space-y-3">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_shows</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Search for shows by venue, date, city, or songs played
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_songs</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Search the song catalog by title</p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_venues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Search for venues by name, city, state, or country
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_segues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Search for song transitions (e.g., "Basis &gt; Helicopters")
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">search_by_date</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Search for shows by exact date, month, or year
                  </p>
                </div>
              </div>
            </div>

            {/* Single Item Getters */}
            <div>
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">
                Get Details
              </h4>
              <div className="space-y-3">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_setlist</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Get full setlist for a show with all sets, songs, and transitions
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Get song details including lyrics and play history
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song_statistics</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Get detailed stats: yearly play counts, gaps between plays
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_song_performances</h5>
                  <p className="text-content-text-secondary text-sm mt-1">
                    Get all performances of a song with venue and rating info
                  </p>
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
              <h4 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">
                Batch Operations
              </h4>
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
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_venues</h5>
                  <p className="text-content-text-secondary text-sm mt-1">Get detailed info for multiple venues</p>
                </div>
                <div>
                  <h5 className="font-mono text-brand-secondary font-semibold text-sm">get_rock_operas</h5>
                  <p className="text-content-text-secondary text-sm mt-1">List the rock operas and their slugs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Usage */}
      <Card variant="panel" className="mt-8 mb-8">
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
