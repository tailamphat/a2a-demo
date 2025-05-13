import os
import sys
from dotenv import load_dotenv
load_dotenv()

key = os.getenv("GOOGLE_API_KEY")
if not key:
    sys.exit("❌ GOOGLE_API_KEY is missing. Edit .env or export the variable and try again.")

print("✅ Key detected – length:", len(key))