import os
import uuid
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import Response, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from faster_whisper import WhisperModel
from gtts import gTTS
import soundfile as sf
from fastapi.responses import StreamingResponse
import io

os.environ["HF_HOME"] = "/tmp"   # force huggingface cache into /tmp
os.environ["XDG_CACHE_HOME"] = "/tmp"

# Whisper model

MODEL_NAME = "tiny"

print("Loading Whisper model...")
try:
    MODEL_NAME = "tiny"
    cache_dir = "/tmp"  # Hugging Face Spaces writable directory
    model = WhisperModel(MODEL_NAME, device="cpu", compute_type="int8", download_root=cache_dir)
    print("✅ Whisper model loaded successfully.")
except Exception as e:
    model = None
    print("❌ Error loading Whisper model:", str(e))

# FastAPI app setup

app = FastAPI(title="Voice Agent Microservice (STT + TTS)")

# Allow CORS (frontend can call APIs)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas

class TTSRequest(BaseModel):
    text: str

# Routes

@app.get("/")
async def root():
    return {"message": "Voice API is running. Use /stt or /tts endpoints."}

@app.get("/health")
def health():
    return {"status": "ok", "stt_loaded": model is not None}

# ---- TTS endpoint ----

@app.post("/tts")
async def tts(text: str = Form(...)):
    if not text:
        return JSONResponse({"detail": "Text is required."}, status_code=400)

    try:
        tts = gTTS(text=text, lang="en")
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

    return StreamingResponse(buf, media_type="audio/mpeg")

# ---- STT endpoint ----

@app.post("/stt")
async def stt(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="STT model not loaded.")

    tmp_path = f"/tmp/{uuid.uuid4().hex}_{file.filename}"
    contents = await file.read()
    with open(tmp_path, "wb") as f:
        f.write(contents)

    try:
        segments, info = model.transcribe(tmp_path)
        text = " ".join([seg.text.strip() for seg in segments if seg.text.strip()])
    except Exception as e:
        print("STT error:", e)
        raise HTTPException(status_code=500, detail="STT processing failed.")
    finally:
        try:
            os.remove(tmp_path)
        except:
            pass

    return {"text": text}

# Run locally

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)