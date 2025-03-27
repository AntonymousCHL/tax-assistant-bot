# Tax Assistant Chatbot

This project is a web-based chatbot that assists users with tax questions.

## Installation

To run this project locally, follow these steps:

### Prerequisites

Ensure you have **Node.js** and **npm** installed. You can check your versions by running the following commands in your terminal:

1. Get API keys from OpenAI (and Anthropic if you would like to upload pdfs).
2. Put those keys in the `.env` file.
3. Run `npm install` to install the required dependencies.
4. Run `npm run dev` to launch the development server (local).

## Assumptions

- The app assumes that the AI SDK and other dependencies are correctly configured and available, especially including the API keys.

## Future Improvements

- Multimedia Elements and TanStack Query implementation of Task 2
- Better colours on the chat box
- Integrate built-in calculator for tax calculations.

## Tech Stack

- **Next.js** (React Framework)
- **Tailwind CSS** (Styling)
- **Vercel AI SDK** (Chatbot Backend)
- **Framer Motion** (Smooth animations)
- **Sonner** (Toast notifications)