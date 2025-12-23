# Query: What terminals are AI developers preferring currently?

**Tool:** webresearcher --effort medium
**Latency:** 50s

## Tokens
- Input: 24779
- Output: 2397

## Cost
$0.0769

## Response

"AI developers" don't use a radically different *terminal emulator* than other developers—but in **2025** there are two clear currents: (1) lots of work happens in **VS Code's integrated terminal**, and (2) there's growing adoption of **AI-native terminals** (especially Warp).

## What's most preferred/commonly used (by what people actually report using)
- **Warp** (macOS/Linux/Windows): Popular largely because it's built around modern UX + built-in AI/agent workflows (command generation, executing tasks, code diffs, etc.). Warp's own "State of the CLI" survey reported Warp as the most common "primary terminal" among its respondents (note the survey skews toward the Warp community). ([warp.dev](https://www.warp.dev/state-of-the-cli-2023?utm_source=openai))
- **VS Code's integrated terminal** (cross-platform): Extremely common for AI/ML work because people live in VS Code (Remote SSH, containers, notebooks, etc.) and just want a terminal *inside* the editor. VS Code documents it as a "fully featured integrated terminal" with features like persistent sessions and deep editor integration. ([code.visualstudio.com](https://code.visualstudio.com/docs/terminal/getting-started?utm_source=openai))
- **iTerm2** (macOS): Still a default "power user" choice on Mac for folks who don't want an AI-first/proprietary terminal. ([en.wikipedia.org](https://en.wikipedia.org/wiki/ITerm2?utm_source=openai))
- **Windows Terminal** (Windows): The mainstream choice on Windows (especially with WSL), with GPU-accelerated rendering and profiles/tabs. ([devblogs.microsoft.com](https://devblogs.microsoft.com/commandline/introducing-windows-terminal/?utm_source=openai))

## The "power-user / performance / highly configurable" set (very common around ML infra work)
These show up a lot with people who spend all day SSH'd into GPU boxes and care about rendering speed, font/ligatures, and automation:

- **WezTerm** (macOS/Linux/Windows): GPU-accelerated, built-in multiplexing features, and **Lua config** (great if you like scripting your terminal setup). ([wezterm.com](https://wezterm.com/?utm_source=openai))
- **kitty** (Linux/macOS): GPU-accelerated and feature-rich (tabs, "kittens", image support, etc.). ([en.wikipedia.org](https://en.wikipedia.org/wiki/Kitty_%28terminal_emulator%29?utm_source=openai))
- **Alacritty** (macOS/Linux/Windows): Minimal, fast, GPU-accelerated; many pair it with tmux/zellij instead of built-in tabs/splits. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Alacritty?utm_source=openai))
- **Ghostty** (macOS/Linux): A newer "modern fast terminal" getting lots of attention for being native + GPU-accelerated + feature-rich. (As of late 2025, Ghostty's docs emphasize macOS+Linux.) ([github.com](https://github.com/ghostty-org/ghostty?utm_source=openai))

## If you tell me 2 things, I can give a much tighter answer
1) What OS are you on (macOS / Windows / Linux)?
2) Do you mean **terminal emulator apps** (Warp/iTerm2/WezTerm/Windows Terminal), or **shells** (zsh/fish/bash), or **remote session tools** (tmux/zellij)?
