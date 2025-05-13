# callbacks.py
from typing import Any, Dict

_BLOCKED_CITIES = {"monaco", "pyongyang", "area 51"}

def weather_tool_guard(tool, args: Dict[str, Any], tool_context):
    """
    Tool-level guard.  If the LLM tries get_weather(city=blocked_city)
    we short-circuit and return an error dict instead of calling the tool.
    """
    city = (args.get("city") or "").lower().strip()

    if city in _BLOCKED_CITIES:
        return {
            "status": "error",
            "error_message": (
                f"⚠️  Sorry, I’m not allowed to provide weather information "
                f"for {city.title()}."
            ),
        }

    # None → let the real tool execute
    return None