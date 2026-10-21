# AI Workplace Productivity Assistant

## Project Overview

The AI Workplace Productivity Assistant is a modern, responsive web application designed to help professionals improve productivity by simplifying common workplace tasks using artificial intelligence.

The application provides a central dashboard with tools for email writing, research assistance, and interactive workplace support. It features a clean purple-and-white interface designed to be user-friendly and accessible across different screen sizes.

## Features Implemented

### 1. Smart Email Generator
- Generate professional emails based on user instructions.
- Support Formal, Friendly, and Persuasive writing tones.
- Allow users to review, edit, and copy generated content.

### 2. AI Research Assistant
- Accept research topics, pasted text, and website URLs.
- Organise research into summaries, key points, insights, and recommendations.
- Present information in readable sections, bullet points, and paragraphs.
- Help users explore topics and understand information more efficiently.

### 3. AI Chatbot
- Provide an interactive interface for workplace-related questions.
- Support writing assistance, brainstorming, explanations, and problem-solving.
- Generate contextual responses using an AI service when correctly configured.

### 4. Dashboard and User Interface
- Modern SaaS-style dashboard.
- Purple-and-white colour scheme.
- Sidebar navigation between application tools.
- Responsive layout for desktop, tablet, and mobile devices.
- Editable outputs and convenient copy actions.
- Responsible AI disclaimer encouraging users to verify important information.

## Technologies and Tools Used

- **HTML** – Web page structure, where applicable.
- **CSS** – Styling, layout, and responsive design.
- **JavaScript / TypeScript** – Application logic and user interactions.
- **React** – Component-based user interface, if used in the generated project.
- **Vite** – Development server and build tooling, if configured.
- **Lovable AI** – AI-assisted application development.
- **Git and GitHub** – Version control and source code management.
- **AI service/API** – Required for genuine AI-generated responses.

*Note: Confirm the actual technologies in the project before finalising this section.*

## Getting Started

### Prerequisites

Before running the project locally, install:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- [Git](https://git-scm.com/)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### AI Configuration

The application requires an AI service to generate genuine AI responses.

If the project uses an environment variable such as `VITE_AI_ENDPOINT`, configure the appropriate service endpoint according to the project's implementation.

Do not place private API keys or secrets in frontend environment variables. Variables prefixed with `VITE_` can be exposed to users in a built frontend. Use a secure backend or managed AI integration for private credentials.

If the AI service is not configured, the Research Assistant and Chatbot may display a message indicating that AI is not connected.

## Privacy and Responsible AI

- Verify AI-generated information before using it for important decisions.
- Avoid entering confidential workplace information or sensitive personal data.
- Protect API keys and other credentials.
- Follow the privacy and usage policies of any connected AI service.

## Project Status

The application frontend and dashboard have been developed using Lovable AI. AI generation depends on the configuration and availability of the connected AI service.

## Team Members

- **Developer:** [Add your name]
- **Project:** AI Workplace Productivity Assistant

## Future Improvements

- Improve AI response formatting and readability.
- Enhance error handling and loading indicators.
- Connect and test the AI features with a secure AI service.
- Improve accessibility and mobile responsiveness.
- Add automated tests for core application features.

## License

This project is available for educational and portfolio purposes. Add a suitable open-source license if you intend to distribute the project under specific reuse terms.
