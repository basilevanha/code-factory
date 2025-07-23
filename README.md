# Code Factory – Interactive Industrial Coding Platform

This project is a web-based educational platform designed to teach coding through industrial machine simulation.
Inspired by platforms like boot.dev, it combines learning paths with hands-on drag-and-drop exercises to build functional automation sequences.

The goal is to help learners understand how to program industrial machines by manipulating a timeline and simulating behavior in 3D via a Unity WebGL game.

---

## 🚀 Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Prettier + ESLint for formatting & linting
- Unity WebGL (embedded game engine)
- (Planned) Stripe API (for subscriptions)
- (Planned) Auth.js (for user authentication)
- (Planned) PostgreSQL + Prisma (for storing progress)

---

## 🧪 Getting Started

Run the development server:

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000 in your browser.

---

## 📁 Project Structure (atomic design)

```
public/Build/   # Unity WebGL export
src/
├── app/            # Routes (Next.js App Router)
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── lib/            # Utilities (Prisma, auth, stripe...)
├── styles/
├── hooks/
├── types/
```

---

## 📦 Deployment

The app is ready for deployment on Vercel or any Node.js-compatible platform.

---

## 💡 Roadmap

- [x] Setup Next.js + Tailwind + Prettier + ESLint
- [ ] First components
- [ ] Embed Unity WebGL
- [ ] User accounts & saved progress (Auth.js + Prisma)
- [ ] Subscription or ad-based access (Stripe + ads)
- [ ] Real-time feedback on exercises

---

Feel free to fork the repo, test locally, and contribute!
