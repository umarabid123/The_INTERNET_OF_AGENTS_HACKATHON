# The_INTERNET_OF_AGENTS_HACKATHON
# 🌍 AI-Powered Travel Agent  
### Built for *The Internet of Agents Hackathon @ Solana Skyline (Sept 14–21, 2025)*  

An AI-powered **travel booking assistant** that lets users **speak with an agent (voice → AI)**, get **flight/hotel recommendations**, and **pay with crypto** via Crossmint.  
The system is orchestrated using **Coral Protocol** to connect multiple agents seamlessly.  

---

## ❗ Problem  
Travelers face multiple challenges when booking trips:  
- Searching across multiple platforms for flights & hotels is time-consuming.  
- Limited personalization in recommendations.  
- Payment options are often restricted and lack modern Web3 support.  
- Complex booking flows lead to user frustration.  

---

## 💡 Solution  
Our **AI-Powered Travel Agent** solves these issues by:  
- Using **voice interaction** to make booking fast & natural.  
- Providing **AI-based personalized recommendations** for flights & hotels.  
- Enabling **crypto payments via Crossmint** for modern, borderless transactions.  
- Orchestrating all agents with **Coral Protocol** into one smooth pipeline.  

---

## 🚀 Features  
- 🎙️ **Voice Interaction**: Speak naturally with the assistant using ElevenLabs (STT & TTS).  
- ✈️ **Recommendations**: Get AI-powered flight & hotel options via Recommendation Agent.  
- 💳 **Web3 Payments**: Pay securely with crypto through Crossmint integration.  
- 🔗 **Agent Orchestration**: Coral Protocol manages communication between all agents.  
- 🌐 **Simple Frontend**: User-friendly React UI (Lovable.dev) for smooth booking flow.  

---

## 🛠 Tech Stack  
- **Coral Protocol** → Multi-agent orchestration  
- **React + Tailwind (Lovable.dev)** → Frontend  
- **ElevenLabs** → Voice (STT/TTS)  
- **LLaMA / Qwen API** → Recommendations  
- **Crossmint** → Web3 Crypto Payments  
- **Mock Datasets** → Flights & hotels  

---

## 🏗 System Architecture  
1. **Frontend (React UI)** → User interacts via voice/text  
2. **Voice Agent (Hassan)** → Converts audio ↔ text  
3. **Coral Orchestrator (Zeeshan)** → Routes messages between agents  
4. **Recommendation Agent (Backend)** → Returns flight/hotel options  
5. **Payment Agent (Jaweria & Zeeshan)** → Processes crypto payments via Crossmint  
6. **Booking Confirmation** → Coral finalizes booking & returns confirmation  

---

## 🔄 Workflow  
1. User speaks: *“Book me a flight from NYC to LA on June 1.”*  
2. Voice Agent → Converts speech to text.  
3. Coral Orchestrator → Sends request to Recommendation Agent.  
4. Recommendation Agent → Returns flight/hotel options.  
5. User selects → “Pay with Crypto.”  
6. Payment Agent → Crossmint checkout flow.  
7. Coral Orchestrator → Confirms booking & generates mock booking ID.  
8. Confirmation shown on UI + optional voice confirmation.  

---

## 👥 Team Roles & Responsibilities  
- **Muhammad Umar Abid – Project Leader / Demo Engineer**  
  - Defined system design & Coral integration  
  - Led demo preparation and handled bug fixes  

- **Ahmad Raza – Frontend Developer**  
  - Built UI with Lovable.dev / React  
  - Integrated flows for voice input, recommendations, and payments  

- **Muhammad Hassan – Voice AI Engineer**  
  - Implemented Speech-to-Text & Text-to-Speech with ElevenLabs  
  - Enabled multilingual interaction  

- **Recommendation Agent – Backend Developer**  
  - Built APIs for search & recommendations  
  - Processed mock datasets (flights + hotels)  

- **Jaweria Siddique – Payment Agent / Documentation**  
  - Integrated payment flow handling  
  - Prepared project documentation & final submission slides  

- **Zeeshan – Blockchain / Payments Developer**  
  - Integrated Crossmint for Web3 crypto checkout  
  - Ensured smooth transaction flow  

---

## 📹 Demo Flow Example  
👉 User: *“Book me a flight from NYC to LA on June 1.”*  
👉 System:  
- Returns options:  
   - Flight 1: June 1, 9 AM, $120  
   - Flight 2: June 1, 2 PM, $150  
- User selects flight  
- Payment via crypto (Crossmint sandbox)  
- Returns: **Booking Confirmed ✅ (ID: BOOK-123)**  

---

## ⚙️ Setup Instructions  
1. Clone this repo:  
   ```bash
   git clone https://github.com/<your-repo>/ai-travel-agent.git
   cd ai-travel-agent


---

## 🌐 Live Demo  
👉 [Click here to try the demo](https://the-internet-of-agents-hackathon.vercel.app/)  

---
## 🏆 Hackathon Details  
- **Event**: The Internet of Agents Hackathon @ Solana Skyline  
- **Date**: September 14–21, 2025  
- **Theme**: Build agentic applications using **Coral Protocol**  

---

## 🔮 Future Improvements  
- 🎙️ Voice-enabled AI travel assistant (fully conversational bookings).  
- 🌍 Multi-language support for global travelers.  
- 💸 Smarter budget optimizations with AI-driven filtering.  
- 💳 Integration with multiple payment gateways for instant booking.  
- ✈️ Real-time airline & hotel API integration.  
- 🛂 NFT-based travel tickets with Solana.  


