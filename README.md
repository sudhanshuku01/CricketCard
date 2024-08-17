
# Cricket Card Game

Welcome to the Cricket Card Game, a multiplayer game where you can enjoy cricket stats, compare players, and compete with friends!

## Getting Started

To get started with the Cricket Card Game, follow these steps:

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd cricket-card-game
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This command starts the Vite development server with Hot Module Replacement (HMR) enabled.

### Building for Production

To build the project for production:

```bash
npm run build
```

This creates an optimized production build of your project in the `dist` directory.

### ESLint Configuration

The project uses ESLint for linting with TypeScript and React support. Here's how ESLint is configured:

- ESLint setup includes rules for TypeScript (`@typescript-eslint`), React (`eslint-plugin-react`), and React Hooks (`eslint-plugin-react-hooks`).
- Type-aware lint rules are enabled by configuring `parserOptions` in `.eslintrc.js`.

### Project Structure

The project structure follows a typical React + TypeScript setup with Vite:

```
cricket-card-game/
├── public/         # Static assets
├── src/            # React components and application logic
│   ├── components/ # Reusable React components
│   ├── pages/      # React components for different pages/views
│   ├── App.tsx     # Main application component
│   └── index.tsx   # Entry point
├── .eslintrc.js    # ESLint configuration
├── tsconfig.json   # TypeScript configuration
├── vite.config.ts  # Vite configuration
└── README.md       # This file
```

### Contributing

Contributions are welcome! If you have any ideas or improvements, feel free to submit a pull request.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Adjust `<repository-url>` with your actual repository URL. This structure and content will help users understand how to set up, develop, and contribute to your Cricket Card Game project using React, TypeScript, and Vite with ESLint for code quality assurance.