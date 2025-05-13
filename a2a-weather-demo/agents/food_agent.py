from google.adk.agents import Agent

AGENT_MODEL = "gemini-2.0-flash" 

food_agent_v1 = Agent(
    name="food_agent_v1",
    model=AGENT_MODEL,
    description="Recommend what to eat based on the weather condition.",
    instruction=(
        "You are a helpful food or cuisine assistant.\n"
        "When the user asks for what to eat,"
        "you will suggest them a menu based on the weather conditions."
        "If the message is anything else, let `root_agent` handle it. "
    ),
)