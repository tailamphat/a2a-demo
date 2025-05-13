"""
The root agent decides which specialised agent (or tool) should answer
each user message.  It owns the get_weather tool itself and delegates all
‘hi/hello/hey’ messages to greeter_agent_v1, and all
‘bye/good-bye/see you’ messages to farewell_agent_v1 and all
‘food recommendation’ messages to food_agent_v1.
"""

from google.adk.agents import Agent
from tools.weather_tool import get_weather
from callbacks import weather_tool_guard
from agents.greeter_agent import greeter_agent_v1
from agents.farewell_agent import farewell_agent_v1
from agents.food_agent import food_agent_v1

AGENT_MODEL = "gemini-2.0-flash"
instruction = (
        "Your job is to decide which of these should handle the user's message:\n"
        "  • YOU - `root_agent` - (call the `get_weather` tool) → if the user asks for weather.\n"
        "  • `greeter_agent_v1`               → if the user greets (hi/hello/hey).\n"
        "  • `farewell_agent_v1`              → if the user says bye / good-bye / see you.\n\n"
        "  • `food_agent_v1`                  → if the user asks for food recommendations.\n\n"
        "If the request doesn’t match any of those, politely reply that you only know "
        "how to give weather reports, greet, say good-bye or give food recommendations based on weather condtions.\n\n"
        "MEMORY RULES:\n"
        "— When you call get_weather(city [, day]) and it succeeds, that CITY is saved as LAST_CITY.\n"
        "— Follow-up patterns:\n"
        "    User: \"And tomorrow?\"\n"
        "    You → call get_weather(city=LAST_CITY, day=\"tomorrow\")\n"
        "    User: \"How about later today?\"\n"
        "    You → call get_weather(city=LAST_CITY, day=\"today\")\n"
        "— If the user asks about the weather but **doesn’t name a city** and LAST_CITY "
        "is unknown, ask them to specify a city.\n"
        "— If the user asks for a date the tool can’t handle (e.g. \"next week\"), "
        "apologise and explain the limitation.\n"
        "— If the user asks about anything else outside of what areas we have defined so far, "
        " Simply answer you don't know."
)

root_agent = Agent(
    name="root_agent",
    model=AGENT_MODEL,
    description="Routes user requests to the correct sub-agent or tool.",
    instruction=instruction, #prompts
    tools=[get_weather],      
    before_tool_callback=weather_tool_guard,
    sub_agents=[greeter_agent_v1, farewell_agent_v1, food_agent_v1],
)