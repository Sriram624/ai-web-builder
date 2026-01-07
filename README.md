# AI Website Architect

![Status](https://img.shields.io/badge/Status-Functional_Prototype-blue)
![Tech](https://img.shields.io/badge/Stack-Next.js_14_|_Tailwind_|_Llama_3-black)

A **Generative UI** application that converts natural language prompts into fully functional, responsive websites in seconds. It leverages **Llama 3.3 (70B)** for reasoning and **Next.js 14** for rendering, bridging the gap between LLM text generation and visual UI construction.

---

##  Key Features

* **Natural Language to UI:** simply type *"A cyberpunk portfolio for a game dev"* and receive a rendered site.
* **Smart Contrast Engine:** Automatically detects AI-generated background colors and enforces accessible text contrast (e.g., white text on dark backgrounds).
* **Crash-Proof Rendering:** Validates AI JSON output before rendering to prevent white-screen crashes on hallucinations.
* **Instant HTML Export:** One-click download of a standalone `index.html` file with embedded Tailwind CSS for immediate deployment.
* **Project History:** Uses a local SQLite database (migratable to PostgreSQL) to save and retrieve past generations.

---

##  Technical Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Provides Server-Side Rendering (SSR) for performance and API routes for backend logic in a single repo. |
| **Styling** | **Tailwind CSS** | Utility-first CSS allows the LLM to style components via strings (`bg-blue-500`) without writing custom CSS files. |
| **AI Inference** | **Groq + Llama 3.3** | Groq LPUs provide sub-2-second generation speeds, offering a "real-time" feel compared to GPT-4's 10s latency. |
| **Database** | **SQLite + Prisma** | Zero-config local database for development, easily swappable for PostgreSQL in production via Prisma schema. |
| **Icons** | **Lucide React** | Lightweight, consistent SVG icon pack that is easy for the AI to map by name. |

---

##  Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js v18+
* NPM or Bun
* A free API Key from [Groq Console](https://console.groq.com)

### 2. Clone & Install
```bash
git clone [https://github.com/your-username/ai-web-builder.git](https://github.com/your-username/ai-web-builder.git)
cd ai-web-builder
npm install