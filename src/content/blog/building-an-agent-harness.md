---
title: "Building an agent harness with AI"
date: 2026-03-31
---

In the spirit of Feynman's "What I cannot create, I do not understand," I set out to build a CLI agent harness from scratch. I was curious about how tools like Claude Code and Codex actually work under the hood. The result is ra https://github.com/chinmaymk/ra a config-driven agent runtime where the config is the agent.

## What this looks like in practice
Before I get into how things work under the hood, here's what ra actually feels like to use:


![ra demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3sqxa6hq0cywbuomxuzz.gif)

```bash
# One-shot - streams to stdout and exits
ra "Summarize the key points of this file" --file report.pdf
# Pipe it, Unix-style
cat error.log | ra "Explain this error"

# Switch providers with a flag
ra --provider openai --model gpt-4.1 "Explain this error"
ra --provider ollama --model llama3 "Write a haiku"

ra # Interactive REPL
ra --http # HTTP API for your app
ra --cron # Scheduled agent runs
# MCP server - so Cursor or Claude Desktop can use ra as a tool
ra --mcp-stdio
# Observability dashboard, see logs, traces, messages, config etc
ra --inspector
```
Same binary, every context. The config file is where it gets interesting:
```yml
# ra.config.yml - drop this in your project root and ra reshapes itself
agent:
  provider: anthropic
  model: claude-sonnet-4-6
  systemPrompt: You are a senior code reviewer. Be direct.
  skillDirs:
    - ./skills/code-review
  middleware:
    afterToolExecution:
      - "./middleware/log-tools.ts"
```
Change the config, change the agent. Same binary becomes a code reviewer, a support bot, a CI debugger, a dataset analyst. The system prompt, the tools, the guardrails, the provider - all configurable. Skills provide packaged context for specific tasks and take away the burden from the system prompt, so you can compose behaviors without one giant prompt. And if you find yourself reusing the same config + skills + middleware combo, you can package it as a recipe - `ra --recipe coding-agent "your task"` and you're off.

## Building it with AI
Every line of code, every test, and every doc in ra was written by AI. I used Claude Code for the entire development.

Setting up the repo with tight feedback loops was the single most important decision. I added unit testing and integration testing early on, and every new change would add and run tests. CLAUDE.md files scattered across the codebase sped up the discovery phase of each agent run by quite a bit - the model didn't have to rediscover the project structure every session. Good context means fewer wasted iterations, which is also why ra auto-discovers context files (CLAUDE.md, AGENTS.md, .cursorrules, etc.) out of the box.

Right-sizing changes required some trial and error, but under 500 lines was the sweet spot. Beyond that, the model started to drift. The ability to follow instructions has gotten to an insane level - even after changing directions a couple of times mid conversation, the model followed through. I rarely used plan mode, most of this was one-shotted and the model did surprisingly well.

I did throw away a bunch of code, primarily because I was exploring directions that did not pan out. That's not a failure of the AI - that's just how building things works. I also frequently sent Claude on codebase-wide hunts - simplify this, fix bugs, ensure readability. The trick was telling it to break things down by directory in src/, it did much better that way and would come back with meaningful things to fix.

For verification, I created a ra config with all the providers and would prompt Claude to spin up ra with that config and perform real actions - hitting real APIs, running real tools. Giving it the experience of running its own software improved the outcome significantly. It found and fixed bugs on its own that tests hadn't caught.

The workflow itself was wonderful: start a session in Claude Code desktop/mobile app, prompt it, push, PR, tests, merge. For PR reviews I'd look at the rough outline and line of thinking but didn't spend time reading through each line - if the tests pass and the approach makes sense, ship it. In this process it was obvious that humans are the bottleneck. I could not operate at the speed the machine wanted to go.

One thing that made me laugh: both Opus and Sonnet would obsessively describe ra as "one binary, 4 interfaces, 5 providers" - compulsively calling out counts, unprompted. Maybe strawberry trauma lol.

## Under the hood
### TypeScript and Bun
I wanted extensions to live in the same memory space as the binary - no stdin/stdout IPC, no sockets. Just bring in JS/TS code directly. TypeScript simplified all of this. Traditionally building a single binary from JS was not that straightforward, but Bun's single-file compile made it a breeze. Bun's built-in SQLite also gave me session persistence and memory for free, which made the choice a bit easier. The other choice was golang, but extending a built binary would've been tricky - either use a less popular language like Lua, or bring in something like QuickJS with cgo, at which point compilation and distribution gets painful.

### Config system
Getting the config system right was more of a design problem than an engineering one. I followed the typical precedence chain - cli flags > env vars > config file > defaults - but the details mattered. Config files can be yml, json, or toml. They support `${VAR:-default}` interpolation like docker compose, which made it easy to keep secrets out of config without extra tooling. Every part of the agent loop is configurable - the system prompt, which tools are enabled, compaction strategy, even which model to use for summarization during compaction. It's been super easy to test different models and providers thanks to having the ability to switch things up from the cli.

### Middleware everywhere
I was tired of applications shipping with rigid internals and not giving users enough freedom to figure out what they need. So I coupled the config system with a flexible middleware layer - not hooks in the traditional sense, these run in the same memory space as the binary, meaning they can directly access and mutate the agent loop. The bet was that if the middleware system was good enough, I could build ra's own features with it. And that's what happened - most of ra's observability (structured logs, traces, the inspector dashboard), permissions, tool filtering, and several other features are all middleware. Users can provide arbitrary js/ts files and ra will call them at every step: before the model call, after tool execution, on each stream chunk, on errors.
```yaml
agent:
  middleware:
    beforeToolExecution:
      - "(ctx) => { if (ctx.toolCall.name.match(/dangerous/)) ctx.deny('blocked'); }"
```

### Autonomous-first
There is no AskUser tool in ra. If the agent needs to ask, we're doing it wrong. The whole point of an autonomous agent is that it operates within well-defined boundaries without hand-holding. So instead of an escape hatch, I focused on making the boundaries tight: max tokens and wall clock time prevent runaway loops, and a regex-based permissions system lets you set up allow/deny lists per tool, even down to specific fields in the tool's input. You can let the model use the filesystem but restrict which directories it touches, or allow network calls but deny certain hosts. ra can run unsupervised and you can still see exactly what happened.

### Observability and the inspector
I couldn't have built half of this without being able to see what ra was actually doing. Early on I was debugging cache hit rates and token usage with log files, and it was painful. So I built an inspector dashboard (`ra --inspector`) - it shows structured logs, traces, every message in the conversation, per-iteration token breakdowns, cache performance, tool call frequency, the resolved config, all of it. It ended up being the most useful debugging tool in the entire project, and I honestly don't know how you'd tune an agent loop without something like it.

### MCP as both client and server
Adding MCP client support was straightforward - ra connects to external MCP servers (databases, file systems, whatever) and exposes their tools to the model. The more interesting decision was making ra an MCP server itself. Meaning you can paste this into your Cursor or Claude Desktop config:
```json
{
  "mcpServers": {
    "ra": {
      "command": "ra",
      "args": ["--mcp-stdio"]
    }
  }
}
```
And now your editor has a full configurable agent loop as a tool. This opened up a direction I want to explore more - agent composition, where one agent exposes itself to others via MCP.

### Context and cache management
One of the core ideas behind ra was giving users full control over what goes into the context window and how. Users can configure which context files get loaded, add their own patterns, control compaction strategies, and decide what stays in the window. On top of that, tokens cost money and LLM providers have implemented caching to reduce costs - to efficiently use the cache, you need to keep static content at the front of the message list and dynamic content at the end. ra has context resolvers - middleware functions that expand file references to actual content - plus a scratchpad tool the model can use. Ensuring both of these work correctly without busting cache every time was a bit of work.

### Dynamic context window detection
I didn't want to hardcode context window limits for every model to trigger compaction. Instead, ra extracts the context window size from the error message providers throw when the window is exhausted. When you exceed the limit, providers like Anthropic and OpenAI return errors that include the actual maximum token count - ra parses that number, caches it, and uses it to trigger compaction before you hit the wall again. It sounds hacky, but it means ra automatically adapts to any model - including custom fine-tunes or newly released models - without maintaining a lookup table.

## Wrapping up
Overall I'm pretty happy with how ra turned out - Its a reasonably small code base standing at ~8k lines. I've been running it all the time with different models on various tasks. The hard parts were never where I expected them to be. Pretty-printing in the terminal, cache optimization, getting the config system right - these took some time. The AI handled actual feature development remarkably well, and thanks to that I ended up getting all the wishlist items too - session persistence, cross-session memory, and the inspector dashboard.

If you're thinking about building something like this: set up tests first, write CLAUDE.md files early, keep changes under 500 lines, and get out of the machine's way. Happy building.

If you wanna checkout ra → https://github.com/chinmaymk/ra