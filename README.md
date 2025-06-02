# TaskBoard Frontend
A modern task management application with github integration.

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components and routes
├── lib/           # Utility functions and configurations
├── hooks/         # Custom React hooks
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Global styles
```

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Query
- **Routing**: React Router DOM
- **Drag and Drop**: @hello-pangea/dnd

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DtPhat/taskboard-fe.git
cd taskboard-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
