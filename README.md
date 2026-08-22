# 🎙️ Voice Assistance

> A modern, voice-based shopping list manager with real-time natural language processing, multilingual speech recognition, smart suggestions, and voice-activated search.

Built in strict compliance with the **Technical Assessment Guidelines** and **Assignment Submission Requirements**.

---

## 🌟 Key Features

### 1. 🗣️ Voice Input & Multilingual NLP
- **Voice Command Recognition**: Native speech-to-text powered by the Web Speech API with real-time audio waveform visual feedback.
- **Natural Language Processing (NLP)**: Understands varied user phrasing (*"I want to buy bananas"*, *"Add milk"*, *"Please add 2 bottles of water"*, *"Get me 3 apples"*).
- **Multilingual Support**: Supports voice input and parsing in **English (US)**, **Spanish (ES)**, **French (FR)**, **German (DE)**, and **Hindi (IN)**.

### 2. 💡 Smart Suggestions
- **Product Recommendations**: Analyzes consumption frequency and history to predict running-low essentials (*"It looks like you're running low on bread"*).
- **Seasonal Recommendations**: Suggests peak-season produce and promotional discounts (*"Organic Honeycrisp Apples are in peak season"*, *"Strawberries 25% off"*).
- **Substitutes**: Proactively offers dietary and out-of-stock alternatives (*"Switch whole milk to Silk Almond Milk"* or *"Gluten-free multigrain bread"*).

### 3. 🛒 Shopping List Management
- **Add / Remove Items**: Voice-activated additions, removals (*"Remove milk from my list"*), and modifications.
- **Auto-Categorization**: Automatically categorizes items into 10 grocery departments (**Produce**, **Dairy & Eggs**, **Bakery**, **Meat & Seafood**, **Pantry**, **Beverages**, **Snacks**, **Frozen**, **Household**, **Personal Care**).
- **Quantity & Unit Management**: Extracts quantities and units (*"Add 2 bottles of water"*, *"Buy 5 oranges"*, *"3 loaves of bread"*).
- **Real-Time Cost Estimation**: Dynamically calculates running totals and unit prices.

### 4. 🔍 Voice-Activated Search & Price Filtering
- **Catalog Search**: Voice query over product database with brand, dietary, and category metadata (*"Find me organic apples"*).
- **Price Range Filtering**: Dynamic price filtering via voice (*"Find toothpaste under $5"*, *"Show snacks under $3"*).

### 5. 📱 Minimalist UI / UX & Voice-Only Interaction
- **Minimalist Interface**: Clean, accessible layout with instant visual feedback for recognized commands.
- **Hands-Free SpeechSynthesis (TTS)**: Voice responses speak back confirmations (*"Added 2 Honeycrisp Apples to Produce"*).
- **Mobile & Touch-Optimized**: Responsive design with big-button microphone trigger and prompt chips.
- **Persistence**: Instant offline storage via `localStorage`.

---

## 🛠️ Minimal & Native Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Speech STT**: Native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Speech TTS**: Native Web Speech API (`SpeechSynthesis`)
- **Storage**: Native `localStorage`

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd gallant-mendeleev
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in Chrome, Edge, or Safari.

### 3. Build for Production
```bash
npm run build
```

---

## 🗣️ Voice Commands Guide

| Feature | Example Voice Commands |
| :--- | :--- |
| **Add Items** | *"Add milk"*, *"I need apples"*, *"Add 2 bottles of water"*, *"Buy 5 oranges"* |
| **Remove Items** | *"Remove milk from my list"*, *"Delete bananas"*, *"Take off bread"* |
| **Search & Price Filter** | *"Find me organic apples"*, *"Find toothpaste under $5"*, *"Show snacks under $3"* |
| **Smart Suggestions** | *"What do you suggest?"*, *"What is in season?"*, *"Show on sale items"* |
| **Clear List** | *"Clear shopping list"*, *"Delete all items"* |
| **Multilingual (ES, FR, DE, HI)** | *"Añadir 2 manzanas"*, *"Ajouter 2 pommes"*, *"2 Äpfel hinzufügen"*, *"दूध जोड़ो"* |

---

## 📋 Submission Checklist Verification

- [x] Application runs cleanly without errors (`npm run build` passes with 0 warnings).
- [x] Code is properly structured, modularized, and strictly typed.
- [x] Dependencies are kept minimal and native.
- [x] Repository excludes `node_modules/`, `.env`, build artifacts (`dist/`), and IDE cache.
- [x] Branch configured as `main`.
- [x] Approach write-up included in `approach_writeup.md` (strictly $\le 200$ words).
