# University Chat Agent

A sophisticated chat interface for querying university information using an AI agent that connects to your backend database.

## Features

- 🎓 **University-themed UI** matching your brand colors (#14244c primary, #ecb31d secondary)
- 💬 **Real-time chat interface** with markdown support
- 📊 **Custom table styling** for database query results
- 📱 **Responsive design** for mobile and desktop
- ⚡ **Fast response times** with loading indicators
- 🎨 **Beautiful typography** using Tailwind CSS prose classes

## Components

### 1. AgentPage

Full-page chat interface with header and help sections.

```tsx
import { AgentPage } from "@/components/agent";

function App() {
  return <AgentPage />;
}
```

### 2. ChatInterface

Standalone chat interface that can be embedded anywhere.

```tsx
import { ChatInterface } from "@/components/agent";

function MyPage() {
  return (
    <div className="h-96">
      <ChatInterface />
    </div>
  );
}
```

### 3. ChatWidget

Floating chat widget for any page.

```tsx
import { ChatWidget } from "@/components/agent";

function Layout() {
  return (
    <>
      {/* Your page content */}
      <ChatWidget />
    </>
  );
}
```

### 4. ChatMessage

Individual message component with markdown rendering.

```tsx
import { ChatMessage } from "@/components/agent";

const message = {
  id: "1",
  content: "# Hello World",
  role: "agent",
  timestamp: new Date(),
};

<ChatMessage message={message} />;
```

## Custom Styling

### Table Styling

Tables in agent responses are automatically styled with:

- University brand colors for headers
- Hover effects with yellow highlight
- Responsive design for mobile
- Rounded corners and shadows

### Markdown Support

- **Bold text** for important information
- Tables with custom styling
- Code blocks with syntax highlighting
- Links with university brand colors
- Blockquotes with accent borders

## API Integration

The chat agent connects to your backend endpoint:

```typescript
// Service automatically calls: GET /agent/query?query={userQuery}
// Response format: { content: string, role: string, time_needed: number }
```

## Environment Setup

Add to your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Usage Examples

### Add to Router

```tsx
// In your router setup
import Agent from '@/pages/Agent';

{
  path: '/agent',
  element: <Agent />,
}
```

### Add Widget to Layout

```tsx
// In your main layout
import { ChatWidget } from "@/components/agent";

export function Layout({ children }) {
  return (
    <div>
      {children}
      <ChatWidget />
    </div>
  );
}
```

### Custom Hook Usage

```tsx
import { useChat } from "@/hooks/useChat";

function MyComponent() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat();

  return <div>{/* Custom chat UI using the hook */}</div>;
}
```

## Styling Customization

### Color Scheme

The chat interface uses CSS custom properties that match your theme:

```css
/* Primary color - Dark blue */
--color-primary: #14244c;

/* Secondary color - Gold */
--color-secondary: #ecb31d;
```

### Custom Table Classes

You can add additional table styling by extending the agent-tables.css:

```css
.agent-table .your-custom-class {
  @apply bg-blue-50 text-blue-900;
}
```

## Dependencies

- `marked` - Markdown parsing and rendering
- `@types/marked` - TypeScript types (deprecated but functional)
- Tailwind CSS - Styling framework
- React 18+ - Component framework

## File Structure

```
src/
├── components/agent/
│   ├── AgentPage.tsx      # Full page component
│   ├── ChatInterface.tsx  # Main chat interface
│   ├── ChatMessage.tsx    # Individual messages
│   ├── ChatWidget.tsx     # Floating widget
│   └── index.ts          # Exports
├── hooks/
│   └── useChat.ts        # Chat state management
├── services/
│   └── agentService.ts   # API communication
├── styles/
│   └── agent-tables.css  # Custom table styling
├── types/
│   └── agent.ts          # TypeScript interfaces
└── pages/
    └── Agent.tsx         # Page component
```

## Backend Integration

Your backend endpoint should return responses in this format:

```json
{
  "content": "# University Information\n\nHere are the available programs:\n\n| Program | Duration | Seats |\n|---------|----------|-------|\n| BSc CSE | 4 years | 120 |\n| MSc CSE | 2 years | 30 |",
  "role": "agent",
  "time_needed": 2.45
}
```

The content supports full Markdown syntax and will be rendered with your custom styling.
