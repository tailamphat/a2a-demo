from google.adk.agents import Agent
from tools.weather_tool import get_weather


AGENT_MODEL = "gemini-2.0-flash" 

weather_agent_v1 = Agent(
    name="weather_agent_v1",
    model=AGENT_MODEL,
    description="Provides weather information for specific cities.",
    instruction=(
        "You are a helpful weather assistant.\n"
        "When the user asks for the weather in a specific city, "
        "use the 'get_weather' tool. "
        "If the tool returns an error, apologise and relay the message. "
        "If it succeeds, present the report clearly."
        "If the message is anything else, let `root_agent` handle it. "
    ),
    tools=[get_weather],
)