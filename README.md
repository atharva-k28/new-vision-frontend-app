# 📷 NewVision – Mobile Image Captioning & OCR App

NewVision is a mobile application built using **React Native (Expo)** that uses your phone's camera to:

- Capture real-time photos 📸  
- Generate accurate **image captions** using AI 🤖  
- Automatically extract and read **text from images (OCR)** 📖  
- Read everything aloud using **speech synthesis** 🔊  

---

## ✨ Features

- Switch between **front/back camera**
- Take a **photo** or choose an existing one
- Send image to backend and **generate captions**
- If any text is detected (via keywords), extract text using **OCR**
- Speech output for both **caption** and **extracted text**
- Works across Android/iOS using **Expo Camera + Expo Speech**
- Clean, scrollable, mobile-first **UI with good UX**

---

## 🛠 Tech Stack

- **Frontend**: React Native + Expo  
- **Camera**: `expo-camera`  
- **Speech**: `expo-speech`  
- **OCR**: Python backend with Tesseract with cleanup
- **Backend**: FastAPI or Flask with `captioning` + `OCR` pipeline  
- **Deployment**: Localhost (ngrok) or Render for now

---

## 🚀 Getting Started

### Prerequisites

- Node.js + Expo CLI
- `Python 3.8+` with OpenCV, `pytesseract`, and image caption model setup

### 1. Clone the repo

```bash
git clone https://github.com/atharva-k28/newvision-app.git
cd newvision-app
