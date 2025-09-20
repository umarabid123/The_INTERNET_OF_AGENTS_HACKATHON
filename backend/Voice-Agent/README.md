# 🎙️ Voice Agent Microservice (STT + TTS)

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-009688?logo=fastapi)
![HuggingFace](https://img.shields.io/badge/Spaces-HuggingFace-yellow?logo=huggingface)
![Whisper](https://img.shields.io/badge/STT-Whisper-orange)
![gTTS](https://img.shields.io/badge/TTS-gTTS-green)

A lightweight **Voice Agent Microservice** that provides both **Speech-to-Text (STT)** and **Text-to-Speech (TTS)** capabilities.  
It is built with **FastAPI**, uses **Whisper** for STT, and **Google gTTS** for TTS.  

This service is designed to be used in AI projects (e.g., Travel Agent) where **voice input and output** are required.  

---

## 🚀 Features
- 🎤 **STT (Speech-to-Text)** → Convert speech audio into text using **Whisper**.  
- 🗣️ **TTS (Text-to-Speech)** → Convert text into natural-sounding voice using **gTTS**.  
- 🌐 Works both **locally** and on **Hugging Face Spaces**.  
- ⚡ Built with **FastAPI** for easy integration.  
- 🔄 REST API endpoints (`/stt`, `/tts`) for quick usage.  

---

## 🛠️ Installation (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/umarabid123/The_INTERNET_OF_AGENTS_HACKATHON.git
cd The_INTERNET_OF_AGENTS_HACKATHON/backend/voice-agent
```

### 2. Install Dependencies
Make sure you have Python 3.9+ installed. Then run:
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
uvicorn app:app --host 0.0.0.0 --port 7860
```

Server will start at:  
👉 `http://127.0.0.1:7860`  

---

## 🌍 Usage on Hugging Face
If deployed to Hugging Face Spaces, you can directly call the API without local setup.  
Example Space:  
👉 `https://<your-hf-space>.hf.space`  

---

## 📡 API Endpoints

### 🔹 Health Check
```http
GET /health
```
Response:
```json
{
  "status": "ok",
  "stt_loaded": true
}
```

### 🔹 Speech-to-Text (STT)
```http
POST /stt
```
**Body (form-data):**
- `file`: audio file (e.g., `.wav`, `.mp3`)

**Response:**
```json
{ "text": "Hello, how are you?" }
```

### 🔹 Text-to-Speech (TTS)
```http
POST /tts
```
**Body (form-data):**
- `text`: string to convert into voice  

**Response:**  
Returns an **MP3 audio file**.

---

## 💡 Example (Python Client)

```python
import requests

# TTS Example
url = "http://127.0.0.1:7860/tts"
data = {"text": "Hello, this is a test!"}
resp = requests.post(url, data=data)

with open("output.mp3", "wb") as f:
    f.write(resp.content)

# STT Example
url = "http://127.0.0.1:7860/stt"
files = {"file": open("sample.wav", "rb")}
resp = requests.post(url, files=files)
print(resp.json())
```

---

## 🎯 Use Cases
- 🤖 AI-powered **Travel Agents** with voice chat.  
- 🧑‍🏫 **Educational bots** that listen & respond.  
- 🩺 **Healthcare assistants** for voice note dictation.  
- 🛠️ General **voice-enabled AI applications**.  

---

## ⚠️ Limitations
- gTTS requires **internet connection** (calls Google API).  
- Whisper model is **tiny** (lightweight, not best accuracy).  
- For production, larger Whisper models or premium TTS (like ElevenLabs) may be preferred.  

---

## 👨‍💻 Author
Developed by **Hassaan** for **Internet of Agents Hackathon** 🚀  
