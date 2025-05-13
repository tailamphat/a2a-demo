from google.adk.agents import Agent

AGENT_MODEL = "gemini-2.0-flash" 
greeter_agent_v1 = Agent(
    name="greeter_agent_v1",
    model=AGENT_MODEL,
    description="Says hello to the user in a friendly way.",
    instruction=(
        "You are a greeter. If the user greets with words like "
        "'hi', 'hello', or 'hey', respond with a warm short greeting. "
        "If the message is anything else, let `root_agent` handle it. "
    ),
)