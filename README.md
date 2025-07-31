# Coding Factory – Interactive Industrial Coding Platform

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
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

Add unity builds in public/unity , then if the files are compressed (default brotli compression by unity) you can open a terminal and run :

```
npm run brotli
```

ou

```
find ./public/unity -type f -name "\*.br" | while read -r file; do brotli --decompress "$file" -o "${file%.br}"; done
```

## 📁 Project Structure (atomic design)

```
coding-factory/
├──public/
│   └──unity/           # Unity WebGL export
└──src/
    ├── app/            # Routes (Next.js App Router)
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   └── organisms/
    ├── lib/            # Utilities (Prisma, auth, stripe...)
    ├── hooks/
    └── types/
```

---

## 📦 Deployment

The app is ready for deployment on Vercel or any Node.js-compatible platform.

---

## 💡 Roadmap

- [x] Setup Next.js + Tailwind + Prettier + ESLint
- [x] First components
- [x] Embed Unity WebGL
- [ ] User accounts & saved progress (Auth.js + Prisma)
- [ ] Subscription or ad-based access (Stripe + ads)
- [ ] Real-time feedback on exercises

---

Feel free to fork the repo, test locally, and contribute!
