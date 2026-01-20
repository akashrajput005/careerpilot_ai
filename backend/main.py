from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AnalysisResult, ResumeInput, ErrorResponse
from config import config
from agent import analyze_profile
import uvicorn
import io
from pypdf import PdfReader

app = FastAPI(title="CareerPilot AI Backend")

# Enable CORS for frontend
# Using allow_origins=["*"] and allow_credentials=False is the most robust way 
# to handle dynamic Vercel preview URLs.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "model": config.MODEL_ID}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parses a PDF file and returns the extracted text.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")
    
    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        return {"filename": file.filename, "text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

@app.post("/analyze", response_model=AnalysisResult, responses={500: {"model": ErrorResponse}})
async def analyze(input_data: ResumeInput):
    return await analyze_profile(input_data)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=config.API_PORT, reload=True)
