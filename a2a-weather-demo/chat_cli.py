#!/usr/bin/env python
"""
Interactive CLI that highlights the multi-agent flow (works on ADK < 0.5.2 too).

Prereqs:
    pip install rich prompt_toolkit python-dotenv
"""
import asyncio
from typing import Optional

from dotenv import load_dotenv
load_dotenv()          # so GOOGLE_API_KEY is visible

from rich.console import Console
from rich.markdown import Markdown
from rich.spinner import Spinner
from prompt_toolkit import PromptSession

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.root_agent import root_agent   # your existing agent tree

# ── helper: resilient agent name ────────────────────────────────────────────
def agent_tag(ev) -> str:
    """Return the producing agent's name if ADK provides it, else 'agent'."""
    return getattr(ev, "agent_name", "agent")

# ── setup runner & terminal UI ──────────────────────────────────────────────
console = Console()
ps = PromptSession()

svc = InMemorySessionService()
svc.create_session(app_name="cli_demo", user_id="u", session_id="s")
runner = Runner(agent=root_agent, app_name="cli_demo", session_service=svc)

# ── main ask() function (streams tokens & shows tool events) ───────────────
async def ask(user_text: str):
    msg = types.Content(role="user", parts=[types.Part(text=user_text)])
    spinner: Optional[Spinner] = None

    async for ev in runner.run_async(
        user_id="u",
        session_id="s",
        new_message=msg,
    ):
        # 1️⃣ tool request
        for call in ev.get_function_calls():
            console.print(
                f"[grey50]↳ {agent_tag(ev)} calls [b]{call.name}[/] {call.args or {}}[/]"
            )

        # 2️⃣ ignore tool responses (handled in final LLM chunk)
        if ev.get_function_responses():
            continue

        # 3️⃣ streaming / final text
        if ev.partial:
            if spinner is None:
                spinner = Spinner("dots", text=f"{agent_tag(ev)} typing…")
                console.print(spinner)
        elif ev.is_final_response():
            if spinner:
                console.print()         # newline after spinner
            reply = ev.content.parts[0].text
            console.print(Markdown(f"**[{agent_tag(ev)}]** {reply}"))

# ── interactive REPL loop ──────────────────────────────────────────────────
async def main():
    console.rule("[bold magenta]A2A Multi-Agent Weather Demo (CLI)")
    console.print("Type [cyan]exit[/] or press Ctrl-D to quit.\n")

    while True:
        try:
            user = await ps.prompt_async("> ")
        except (EOFError, KeyboardInterrupt):
            break
        if user.strip().lower() in {"exit", "quit"}:
            break
        console.print(f"[bold green]You:[/] {user}")
        await ask(user)

if __name__ == "__main__":
    asyncio.run(main())