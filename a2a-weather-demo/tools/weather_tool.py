# tools/weather_tool.py
from typing import Dict
from google.adk.tools import ToolContext

TODAY = {
    "hochiminh": "The weather in Ho Chi Minh city is sunny, 30 °C.",
    "london":  "It’s cloudy in London, 15 °C.",
    "tokyo":   "Tokyo has light rain, 18 °C.",
}
TOMORROW = {
    "hochiminh": "Tomorrow Ho Chi Minh city will be partly cloudy, 22 °C.",
    "london":  "Tomorrow London sees light showers, 14 °C.",
    "tokyo":   "Tomorrow Tokyo clears up to 20 °C with sun.",
}

def get_weather(city: str, day: str, tool_context: ToolContext = None) -> Dict[str, str]:
    """
    Mock weather lookup. `day` may be 'today' or 'tomorrow'.
    """
    db = TODAY if day.lower() == "today" else TOMORROW
    key = city.lower().replace(" ", "")

    if key in db:
        # remember last city
        if tool_context:
            tool_context.state["last_city"] = city
        return {"status": "success", "report": db[key]}

    return {"status": "error",
            "error_message": f"Sorry, I don’t have weather info for “{city}”."
           }