from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeInput(BaseModel):
    role: str = Field(..., description="The target job role")
    resume_text: str = Field(..., description="The content of the resume")

class SkillGap(BaseModel):
    skill: str
    importance: str
    recommendation: str

class DayPlan(BaseModel):
    day: int
    focus: str
    activities: List[str]

class MockQuestion(BaseModel):
    question: str
    expected_answer_format: str
    tips: str

class AnalysisResult(BaseModel):
    is_sufficient: bool = Field(..., description="Whether the resume input is sufficient for analysis")
    clarification_questions: List[str] = Field(default_factory=list, description="Questions to ask if input is insufficient")
    quality_score: Optional[int] = Field(None, ge=0, le=100)
    relevance_score: Optional[int] = Field(None, ge=0, le=100)
    missing_skills: List[SkillGap] = Field(default_factory=list)
    seven_day_plan: List[DayPlan] = Field(default_factory=list)
    mock_interview_questions: List[MockQuestion] = Field(default_factory=list)
    overall_feedback: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
