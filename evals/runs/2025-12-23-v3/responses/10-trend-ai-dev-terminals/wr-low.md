# Query: What terminals are AI developers preferring currently?

**Tool:** webresearcher --effort low
**Latency:** 42s

## Tokens
- Input: 20553
- Output: 1534

## Cost
$0.0574

## Response

As of **late 2025 (Dec 23, 2025)**, there isn't one "AI-dev terminal," but the same handful shows up repeatedly among people doing AI/ML work (Python, CUDA tooling, Docker/K8s, SSH into GPU boxes). The preference usually follows **OS + workflow (IDE-first vs terminal-first)**:

## Most commonly preferred (practical defaults)
- **VS Code integrated terminal** — extremely common because a lot of AI dev happens inside VS Code/Jupyter-in-VS-Code, and the terminal is tightly integrated with the editor. ([code.visualstudio.com](https://code.visualstudio.com/docs/terminal/getting-started?utm_source=openai))
- **Windows Terminal (Windows)** — the de‑facto modern choice on Windows (nice tabbing/profiles; works well with WSL + PowerShell). ([github.com](https://github.com/microsoft/terminal?utm_source=openai))
- **iTerm2 (macOS)** — still a "standard" in many teams; notably it even advertises a built-in **AI Chat** feature now. ([github.com](https://github.com/gnachman/iTerm2?utm_source=openai))

## "AI-native" terminal choice (fast-growing mindshare)
- **Warp (macOS primarily, but expanding)** — explicitly positioned around AI/agent features and collaboration; Warp publishes usage data via its "State of the CLI" survey and continues adding "Active AI" and session sharing workflows. ([warp.dev](https://www.warp.dev/state-of-the-cli-2023))
  (Note: their survey is inherently Warp-audience-biased, but it's still a useful signal.)

## Performance-focused terminals many power users (incl. AI devs) are switching to
These are popular when you live in `tmux`, SSH a lot, or want low-latency rendering for heavy output:
- **Ghostty** — strong momentum recently; marketed as fast, native UI, GPU accelerated. ([github.com](https://github.com/ghostty-org/ghostty?utm_source=openai))
- **WezTerm** — cross-platform, GPU-accelerated, terminal + multiplexer style workflow. ([github.com](https://github.com/wezterm/wezterm?utm_source=openai))
- **kitty** — GPU-based, feature-rich, cross-platform. ([github.com](https://github.com/kovidgoyal/kitty?utm_source=openai))
- **Alacritty** — minimal, very fast, OpenGL-based, cross-platform. ([github.com](https://github.com/alacritty/alacritty?utm_source=openai))

## A good "pick" depending on your setup
- If you're **IDE-first** (Copilot, notebooks, debugging): **VS Code terminal**
- If you want **AI help inside the terminal**: **Warp** (or **iTerm2** on macOS for its AI chat feature)
- If you want **speed + tmux/SSH heavy use**: **Ghostty / WezTerm / kitty / Alacritty**
- If you're on **Windows + WSL2**: **Windows Terminal**

If you tell me **your OS (macOS/Windows/Linux)** and whether you're mostly **local dev vs SSH into remote GPU machines**, I can narrow this to 2–3 best fits (and suggest a solid default config: font, ligatures, keybindings, shell integration, tmux/no-tmux).
