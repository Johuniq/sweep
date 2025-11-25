<div align="center">
  <h1>Sweep</h1>
  <p><strong>A modern, open-source gradient generator for designers and developers</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
  
  [Live Demo](https://sweep.jolyui.dev) · [Report Bug](https://github.com/Johuniq/sweep/issues) · [Request Feature](https://github.com/Johuniq/sweep/issues)
</div>

---

## ✨ Features

- **🎨 Powerful Gradient Editor**
  - Linear and radial gradient support
  - Multi-stop color control with intuitive UI
  - Real-time preview with high-resolution rendering
- **🎛️ Advanced Effects**

  - Adjustable noise and blur effects
  - Canvas-based rendering for smooth visuals
  - Customizable gradient angles and positions

- **📤 Multiple Export Options**

  - CSS code generation
  - Tailwind CSS utility classes
  - High-quality JPG export
  - One-click copy to clipboard

- **🎭 Modern UX**
  - Responsive design for all screen sizes
  - Dark mode support with `next-themes`
  - Smooth animations powered by Motion
  - Accessible components built with Radix UI

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm installed
- Basic knowledge of React and Next.js

### Installation

```bash
# Clone the repository
git clone https://github.com/Johuniq/sweep.git
cd sweep

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Analytics and site configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
```

---

## 📦 Tech Stack

| Category       | Technology                                                |
| -------------- | --------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router)            |
| **UI Library** | [React 19](https://react.dev/)                            |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)             |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com/)               |
| **Components** | [Radix UI](https://www.radix-ui.com/)                     |
| **Animations** | [Motion](https://motion.dev/)                             |
| **Theme**      | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Analytics**  | [Vercel Analytics](https://vercel.com/analytics)          |

---

## 📁 Project Structure

```
sweep/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage entry
│   ├── globals.css               # Global styles
│   └── *.ts                      # Metadata routes (sitemap, robots, etc.)
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── gradient-generator/   # Main gradient editor
│   │   │   ├── color-stops-editor.tsx
│   │   │   ├── effect-controls.tsx
│   │   │   ├── export-controls.tsx
│   │   │   └── use-gradient-generator.ts
│   │   └── *.tsx                 # Other UI components
│   ├── home-page.tsx             # Homepage client component
│   ├── Navbar.tsx                # Navigation header
│   └── Footer.tsx                # Footer component
│
├── lib/                          # Utility functions
│   ├── utils.ts                  # General utilities
│   ├── seo.ts                    # SEO helpers and config
│   └── motion-utils.ts           # Animation utilities
│
└── public/                       # Static assets
```

---

## 🛠️ Available Scripts

```bash
pnpm dev        # Start development server (localhost:3000)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, feature additions, or documentation improvements, all contributions are welcome.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests and linting** (`pnpm lint && pnpm build`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

Please read our [Contributing Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please check existing [issues](https://github.com/Johuniq/sweep/issues) first, then feel free to open a new one.

**For bugs, please include:**

- Your OS and browser version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/) and [Dicons](https://dicons.dev/)
- Animations powered by [Motion](https://motion.dev/)

---

## 🔗 Links

- **Website**: [sweep.jolyui.dev](https://sweep.jolyui.dev)
- **GitHub**: [github.com/Johuniq/sweep](https://github.com/Johuniq/sweep)
- **Report Issues**: [GitHub Issues](https://github.com/Johuniq/sweep/issues)
---

## 📧 Contact

For security issues or private inquiries, contact: **support@johuniq.tech**

---

<div align="center">
  Made with ❤️ by <a href="https://johuniq.tech">Johuniq</a>
</div>
