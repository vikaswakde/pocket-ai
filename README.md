# PocketCard Component

## Overview

`PocketCard.tsx` is a self-contained, animated React component that provides a user interface for interacting with various large language models (LLMs). It presents a "pocket AI" card that users can open to select from a list of AI models, and then engage in a chat conversation with the selected model.

The component is designed to be a "plug-and-play" chat interface, with a rich, animated UI built using `motion/react` (Framer Motion) and styled with Tailwind CSS.

## Features

-   **Model Selection:** Displays a list of AI models grouped by provider (e.g., Google, Meta, Mistral).
-   **Collapsible Sections:** Model groups can be expanded and collapsed.
-   **Chat Interface:** A seamless transition from model selection to a full-featured chat view.
-   **Separate Chat Histories:** Maintains individual chat history for each AI model.
-   **Real-time Interaction:** Uses `@ai-sdk/react` for streaming chat responses from a backend API.
-   **Error Handling:** Displays informative error messages, including for rate limiting.
-   **Rich Animations:** Fluid animations for opening/closing the card, switching views, and displaying messages, powered by `motion/react`.
-   **Custom Icons:** Supports both SVG icon components and image-based icons for models.
-   **Responsive Design:** Styled with Tailwind CSS for a modern look and feel.

## Dependencies

This component relies on several external libraries:

-   `react`: For building the component.
-   `@ai-sdk/react`: For chat state management and backend communication.
-   `motion/react`: For all UI animations.
-   `lucide-react`: For icons.
-   `geist`: For the sans-serif font.
-   `@lobehub/icons`: For AI model provider logos.
-   `next/image`: For optimizing image icons.
-   `tailwindcss`: For styling.
-   `cn` utility (like `clsx` or `tailwind-merge`): for conditional class names.

## File Structure

The `PocketCard` functionality is primarily split across two files:

-   `src/components/PocketCard.tsx`: The main component file containing all the logic, state management, and JSX for rendering the UI.
-   `src/data/aiModels.ts`: A data file that exports the list of AI models to be displayed in the card.

## Component Breakdown

### State Management

The component uses React hooks (`useState`, `useRef`, `useEffect`) to manage its state:
-   `open`: Toggles the visibility of the entire card.
-   `isChatMode`: Switches between the model selection view and the chat view.
-   `selectedModel`: Stores the ID of the currently selected model for chat.
-   `expandedModels`: Keeps track of which model provider groups are expanded.
-   `chatHistories`: An object that stores the message history for each model, keyed by model ID.
-   `errorMessage` / `isRateLimited`: Handle and display errors from the chat API.

### Chat Functionality (`useChat`)

The core of the chat logic is handled by the `useChat` hook from `@ai-sdk/react`.
-   It's initialized with the API endpoint `/api/chat`.
-   It dynamically sends the `apiId` of the `selectedModel` in the request body.
-   It handles messages, input state, form submission, and the status of the API request (e.g., `streaming`, `submitted`).
-   Callbacks like `onError`, `onResponse`, and `onFinish` are used to handle API responses, update error states, and save chat history.

### Model Data (`aiModels.ts`)

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

### Animations (`motion/react`)

Animations are a key part of the user experience.
-   `AnimatePresence`: Manages the mounting and unmounting animations of components (e.g., the main card, chat messages).
-   `motion.div`: Used extensively with `initial`, `animate`, `exit`, and `variants` props to create complex, spring-based animations.
-   `variants`: Pre-defined animation states (e.g., `listVariants`, `caretVariants`) are used for consistency and cleaner code.

## How to Use

To use the `PocketCard` component, simply import it and render it in your application. Ensure that you have a corresponding API route set up at `/api/chat` that can handle requests from `@ai-sdk/react`.

```jsx
// Example: in your page.tsx
import PocketCard from '@/crafts/PocketCard';

export default function HomePage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <PocketCard />
    </main>
  );
}
```

Make sure the backend API at `/api/chat` is configured to accept a `model` property in the request body and stream back responses in the format expected by the AI SDK.
