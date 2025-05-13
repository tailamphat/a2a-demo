# memory.py
"""
Ultra-simple session-scoped memory using the SessionService extras dict.
We’ll save & load values by keys like 'last_city'.
"""

KEY_LAST_CITY = "last_city"

def save(session, *, last_city: str):
    session.extras[KEY_LAST_CITY] = last_city

def load(session):
    return session.extras.get(KEY_LAST_CITY)