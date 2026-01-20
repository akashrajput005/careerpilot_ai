from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
from config import config
from schemas import AnalysisResult, ResumeInput
from loguru import logger

import os
from pydantic_ai.models.openrouter import OpenRouterModel

# OpenRouterModel picks up the API key from the environment variable
os.environ["OPENROUTER_API_KEY"] = config.OPENROUTER_API_KEY
model = OpenRouterModel(config.MODEL_ID)

career_agent = Agent(
    model,
    output_type=AnalysisResult,
    model_settings={"max_tokens": 800},
    retries=3,
    system_prompt=(
        "You are an expert Career Coach and Placement Officer named CareerPilot AI."
        "Your goal is to help final-year students prepare for campus placements."
        "When a student provides their target role and resume content, you must:"
        "1. Validate if the input is sufficient (e.g., contains enough context about skills and experience)."
        "2. If insufficient, set is_sufficient to False and provide professional follow-up questions."
        "3. If sufficient, analyze the resume quality and its relevance to the target role."
        "4. Identify critical missing skills for that role."
        "5. Generate a highly personalized 7-day preparation plan."
        "6. Provide 5 relevant mock interview questions with tips."
        "Be encouraging, professional, and practical in your advice."
    ),
)

@career_agent.tool
async def validate_input(ctx: RunContext[None], role: str, resume_text: str) -> str:
    """Helper tool to check basic input quality before full analysis."""
    if len(resume_text.split()) < 50:
        return "The resume content seems too short. Please provide more details about your projects, skills, and experience."
    return "Input content looks sufficient for initial analysis."

async def analyze_profile(user_input: ResumeInput) -> AnalysisResult:
    try:
        logger.info(f"Analyzing profile for role: {user_input.role}")
        result = await career_agent.run(
            f"Role: {user_input.role}\nResume Content: {user_input.resume_text}"
        )
        return result.output
    except Exception as e:
        logger.error(f"Agent execution failed: {str(e)}")
        raise e
