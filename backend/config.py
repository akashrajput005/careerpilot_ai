import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Config(BaseModel):
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    MODEL_ID: str = os.getenv("MODEL_ID", "google/gemini-2.0-flash-exp:free")
    API_PORT: int = int(os.getenv("PORT", os.getenv("API_PORT", "8000")))

config = Config()
