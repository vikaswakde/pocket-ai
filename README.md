# PocketCard Component

## Overview

`PocketCard.tsx` is a self-contained, animated React component that provides a user interface for interacting with various large language models (LLMs). It presents a "pocket AI" card that users can open to select from a list of AI models, and then engage in a chat conversation with the selected model.

The component is designed to be a "plug-and-play" chat interface, with a rich, animated UI built using `motion/react` (Framer Motion) and styled with Tailwind CSS.

## Features

- **Model Selection:** Displays a list of AI models grouped by provider (e.g., Google, Meta, Mistral).
- **Collapsible Sections:** Model groups can be expanded and collapsed.
- **Chat Interface:** A seamless transition from model selection to a full-featured chat view.
- **Separate Chat Histories:** Maintains individual chat history for each AI model.
- **Real-time Interaction:** Uses `@ai-sdk/react` for streaming chat responses from a backend API.
- **Error Handling:** Displays informative error messages, including for rate limiting.
- **Rich Animations:** Fluid animations for opening/closing the card, switching views, and displaying messages, powered by `motion/react`.
- **Custom Icons:** Supports both SVG icon components and image-based icons for models.
- **Responsive Design:** Styled with Tailwind CSS for a modern look and feel.

## Dependencies

This component relies on several external libraries:

- `react`: For building the component.
- `@ai-sdk/react`: For chat state management and backend communication.
- `motion/react`: For all UI animations.
- `lucide-react`: For icons.
- `geist`: For the sans-serif font.
- `@lobehub/icons`: For AI model provider logos.
- `next/image`: For optimizing image icons.
- `tailwindcss`: For styling.
- `cn` utility (like `clsx` or `tailwind-merge`): for conditional class names.

## File Structure

The `PocketCard` component and its logic are organized into the following structure:

- `components/pocket-card/PocketCard.tsx`: The main component file, responsible for rendering the UI and orchestrating the custom hooks.
- `components/pocket-card/hooks/`: A directory containing custom React hooks that encapsulate the component's logic.
  - `usePocket.ts`: The main hook that composes all other hooks and provides props to the `PocketCard` component.
  - `useUserSession.ts`: Manages user authentication state (including anonymous users) and handles chat migration upon sign-in.
  - `useChatHistory.ts`: Handles all interactions with the Convex database for fetching and saving chat history.
  - `useAIModelManager.ts`: Manages the state related to AI model selection and UI presentation.
  - `useAIChat.ts`: A wrapper around the Vercel AI SDK's `useChat` hook, managing real-time chat state and API communication.
- `data/aiModels.ts`: A data file that exports the list of AI models to be displayed.

## Architecture: The Hook-Based Approach

The component's logic is cleanly separated into several custom hooks, following the "separation of concerns" principle. The `PocketCard.tsx` component remains lean, focusing primarily on rendering the UI, while the complex logic is delegated to the hooks.

### Core Hooks

- **`usePocket.ts`**: This is the central orchestrator hook. It brings together all the other specialized hooks, manages high-level UI state (like `isChatMode`), and exposes all the necessary data and event handlers to the `PocketCard` component.

- **`useUserSession.ts`**: Handles all aspects of the user's session. It uses `useConvexAuth` to determine if a user is authenticated, manages a unique ID for anonymous users stored in `localStorage`, and contains the logic to migrate an anonymous user's chats to their account when they sign in.

- **`useAIModelManager.ts`**: Manages the state and logic for the model selection view. This includes which model is currently selected, which provider groups are expanded, and helper functions to get information about the selected model.

- **`useChatHistory.ts`**: Acts as the data layer for chat history. It uses Convex queries (`useQuery`) to fetch the list of user chats and the messages for the active chat. It also provides Convex mutations (`useMutation`) to create new chats and save new messages to the database.

- **`useAIChat.ts`**: This hook is a dedicated wrapper for the Vercel AI SDK's `useChat` hook. It's configured to communicate with the `/api/chat` backend endpoint. It handles the real-time aspects of the chat, including managing the `messages` array, the user's `input`, and the API request `status`. It also contains the `onFinish`, `onError`, and `onResponse` callbacks to handle chat persistence and error states like rate limiting.

## Model Data (`aiModels.ts`)

The `aiModels` array defines the structure of the model list. Each parent model object can have a `children` array containing specific sub-models.

The `Model` type is defined within `PocketCard.tsx` and imported into `aiModels.ts`.

```typescript
// src/crafts/PocketCard.tsx
export type Model = {
  id: string;
  name: string;
  description: string;
  Icon: React.ComponentType | any; // Can be a component or an image path
  apiId: string;
  children?: Model[];
};
```

The `PocketCard` component iterates over this array to render the nested list of models.

## Animations (`motion/react`)

Animations are a key part of the user experience.

- `AnimatePresence`: Manages the mounting and unmounting animations of components (e.g., the main card, chat messages).
- `motion.div`: Used extensively with `initial`, `animate`, `exit`, and `variants` props to create complex, spring-based animations.
- `variants`: Pre-defined animation states (e.g., `listVariants`, `caretVariants`) are used for consistency and cleaner code.

## How to Use

To use the `PocketCard` component, simply import it and render it in your application. Ensure that you have a corresponding API route set up at `/api/chat` that can handle requests from `@ai-sdk/react`.

```jsx
// Example: in your page.tsx
import PocketCard from "@/crafts/PocketCard";

export default function HomePage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <PocketCard />
    </main>
  );
}
```

Make sure the backend API at `/api/chat` is configured to accept a `model` property in the request body and stream back responses in the format expected by the AI SDK.
