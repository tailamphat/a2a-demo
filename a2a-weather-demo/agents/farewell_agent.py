from google.adk.agents import Agent

AGENT_MODEL = "gemini-2.0-flash"
farewell_agent_v1 = Agent(
    name="farewell_agent_v1",
    model=AGENT_MODEL,
    description="Says good-bye to the user.",
    instruction=(
        "You are a farewell agent. If the user says words like "
        "'bye', 'good-bye', 'see you', respond with a polite short farewell. "
        "If the message is anything else, let `root_agent` handle it. "
    ),
)