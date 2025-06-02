# Trello Mini Frontend

A modern task management application built with React, TypeScript, and Vite, featuring a beautiful UI powered by Tailwind CSS and Radix UI components.

## 🚀 Features

- Modern and responsive UI using Tailwind CSS
- Drag and drop functionality for task management
- Form handling with React Hook Form and Zod validation
- Beautiful UI components from Radix UI
- Type-safe development with TypeScript
- Fast development with Vite

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
git clone [repository-url]
cd trello-mini-fe
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

## 🎨 UI Components

The project uses a comprehensive set of UI components from Radix UI, including:
- Accordion
- Alert Dialog
- Avatar
- Checkbox
- Dialog
- Dropdown Menu
- Navigation Menu
- Toast notifications
- And many more...

## 📝 Code Style

The project uses ESLint for code linting and follows TypeScript best practices. Make sure to run the linter before committing:

```bash
npm run lint
```

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
