# Pocket AI

A modern, open-source AI chat application that allows you to interact with various cutting-edge language models. Pocket AI provides a sleek and intuitive interface for seamless conversations with your favorite AI models.

![Pocket AI Overview](https://github.com/user-attachments/assets/77d5dbef-b076-466b-9c68-c2990fcd7aa0)

## 🌐 Visit Pocket AI

Experience Pocket AI in action at [www.pocketai.site](https://www.pocketai.site)

## ✨ Features

- **Multi-Model Support:** Chat with a variety of AI models from different providers.
- **Real-time Conversations:** Enjoy a smooth, real-time chat experience powered by Convex.
- **User Authentication:** Secure user authentication with Clerk.
- **Markdown Support:** Rich text formatting for AI responses with Markdown rendering.
- **Sleek UI:** A beautiful and responsive user interface built with Next.js, Tailwind CSS, and Framer Motion.
- **Themeable:** Switch between light and dark modes.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Backend & Database:** [Convex](https://www.convex.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://www.ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/)
- A [Convex](https://www.convex.dev/) account
- A [Clerk](https://clerk.com/) account
- API keys for [OpenRouter](https://openrouter.ai/) and/or [Perplexity](https://www.perplexity.ai/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/pocket-ai.git
    cd pocket-ai
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables. You can get these values from your Convex, Clerk, OpenRouter, and Perplexity dashboards.

    ```env
    OPENROUTER_API_KEY="your_openrouter_api_key"
    PERPLEXITY_API_KEY="your_perplexity_api_key"
    UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
    UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
    IP_ALLOWLIST="your_ip_allowlist"

    # Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/


    # DB
    CONVEX_DEPLOYMENT="your_convex_deployment"
    NEXT_PUBLIC_CONVEX_URL="your_convex_url"
    CLERK_FRONTEND_API_URL="your_clerk_frontend_api"
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

Here's an overview of the key directories in this project:

- `app/`: Contains the pages and layouts of the Next.js application.
- `components/`: Reusable React components used throughout the application. The core UI logic is in `components/pocket-card`.
- `convex/`: Holds the Convex backend functions and the database schema (`schema.ts`).
- `lib/`: Utility functions.
- `public/`: Static assets like images and fonts.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vikaswakde/pocket-ai/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
