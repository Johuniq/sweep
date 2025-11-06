# Sweep

Sweep is an open-source gradient generator built with the Next.js App Router. The project focuses on developer productivity, accessibility, and production-ready SEO, providing a solid foundation for agencies or teams that need a customizable gradient workflow.

## Features

- Linear and radial gradient authoring with multi-stop control
- Optional noise and blur effects rendered on a high-resolution canvas
- Export helpers for CSS, Tailwind utility classes, and high-quality JPG output
- Responsive layout with automatic dark mode support (`next-themes`)
- Production-ready SEO surfaces (metadata, sitemap, robots, manifest, Open Graph, Twitter)
- Animated GitHub star button powered by Motion for micro-interactions

## Tech Stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) primitives
- [Motion](https://motion.dev/) for animations
- [next-themes](https://github.com/pacocoursey/next-themes) for theme switching

## Getting Started

```bash
pnpm install
pnpm dev
```

The application starts on `http://localhost:3000`. Environment variables can be configured via `.env.local`; refer to `.env.example` for available keys.

## Scripts

```bash
pnpm dev       # Start the development server
pnpm build     # Create an optimized production build
pnpm start     # Launch the production server locally
pnpm lint      # Run ESLint over the project
```

## Project Structure

```
app/                # App Router entrypoints and metadata routes
components/         # Reusable UI including the gradient editor
lib/                # Shared utilities (SEO helpers)
public/             # Static assets, icons, and screenshots
```

Notable modules:

- `app/page.tsx` – Server component entry point rendering the page shell
- `components/home-page.tsx` – Client component with hero and gradient generator
- `lib/seo.ts` – Metadata helpers, structured data generators, and site config
- `app/{sitemap,robots,manifest}.ts` – SEO and PWA endpoints

## Contributing

Contributions are welcome. Please review the [contribution guidelines](./CONTRIBUTING.md) before opening a pull request. Ensure linting and production builds succeed locally (`pnpm lint` and `pnpm build`). By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

If you believe you have found a security vulnerability, contact `support@johuniq.tech` or open a private issue so we can coordinate a fix before disclosure.

## License

This project is licensed under the [MIT License](./LICENSE).

---

Maintained by the Johuniq.
