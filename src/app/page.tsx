'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CodingFactoryLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [salary, setSalary] = useState(38000);
  const salarySectionRef = useRef<HTMLDivElement | null>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !animationStarted.current) {
          animationStarted.current = true;
          animateSalary();
        }
      },
      { threshold: 0.4 }
    );
    if (salarySectionRef.current) observer.observe(salarySectionRef.current);
    return () => observer.disconnect();
  }, []);

  function animateSalary() {
    const target = 55000;
    const startValue = 38000;
    const duration = 1300;
    const start = performance.now();
    function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * (2 - t);
      const value = Math.round(startValue + (target - startValue) * eased);
      setSalary(value);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const advantages = [
    {
      icon: '🧠',
      title: 'Apprentissage interactif',
      desc: 'Codez, testez et visualisez en 3D — feedback immédiat sur chaque action.',
    },
    {
      icon: '🧭',
      title: 'Progression guidée',
      desc: 'Parcours pas-à-pas : débloquez des compétences concrètes !',
    },
    {
      icon: '🏭',
      title: 'Cas industriels réels',
      desc: 'Scénarios inspirés d’usines : convoyeurs, robots, machines de conditionnement.',
    },
    {
      icon: '🚫',
      title: 'Sans installation',
      desc: 'Projet en WebGL — pas besoin d’installer de gros logiciel pour débuter.',
    },
    {
      icon: '📜',
      title: 'Certification',
      desc: 'Attestez de vos compétences et valorisez votre CV auprès des recruteurs.',
    },
  ];

  const faqs = [
    {
      q: 'Faut-il avoir déjà utilisé TIA Portal, GXprogrammer, EcoStruxure... ?',
      a: 'Non. La formation commence par les bases et propose des modules intermédiaires et avancés.',
    },
    {
      q: 'Puis-je apprendre sans être électrotechnicien ?',
      a: 'Oui — Les principes sont expliqués étape par étape en commençant par les bases.',
    },
    {
      q: 'Comment fonctionne la démo interactive ?',
      a: 'La démo s’ouvre dans une scène Web : vous éditez du ladder, exécutez et voyez la simulation 3D.',
    },
    {
      q: 'La formation est-elle certifiante ?',
      a: 'Oui — un certificat est délivré après évaluation finale et exercices pratiques.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* === Header fixe compact === */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-slate-700 to-slate-600 shadow-md">
              <Image
                src="/image/logo-Technical Solutions.png"
                alt="Coding Factory Logo"
                width={24}
                height={24}
                className="h-5 w-5 object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                CodingFactory
              </h1>
              <p className="-mt-0.5 text-[11px] text-slate-400">
                Programmation industrielle
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3">
            <Link
              href="/games/step1"
              className="hidden rounded-md border border-green-500 px-3 py-1 text-sm text-green-300 transition-all duration-300 hover:bg-green-500/10 hover:shadow-[0_0_20px_4px_rgba(34,197,94,0.6)] md:inline-block"
            >
              Tester la démo
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* === Hero plein écran ajusté === */}
      <section className="relative flex min-h-[calc(100vh-56px)] items-center justify-center px-6 pt-[56px]">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center justify-center gap-12 md:flex-row md:gap-20">
          {/* Colonne gauche - Texte */}
          <div className="max-w-xl flex-1 text-center md:text-left">
            <p className="mb-3 text-sm font-semibold tracking-wide text-green-400 uppercase">
              Nouveau · Formation interactive
            </p>

            <h1 className="text-5xl leading-tight font-extrabold md:text-6xl">
              Apprends à{' '}
              <span className="text-green-400">
                programmer ton premier automate
              </span>{' '}
              en moins de 10&nbsp;minutes
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Plonge dans <strong>Coding Factory</strong> — un monde 3D
              interactif où tu <strong>programmes des usines</strong> sans rien
              installer. Progresse pas à pas jusqu’à ton premier projet
              fonctionnel.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
              <Link
                href="/games/step1"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_6px_rgba(34,197,94,0.6)]"
              >
                🎮 Tester la démo
              </Link>
              <a
                href="#avantages"
                className="text-sm text-slate-300 underline hover:text-green-400"
              >
                Voir pourquoi ça marche
              </a>
            </div>
          </div>

          {/* Colonne droite - Vidéo */}
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/5 shadow-2xl md:max-w-xl">
              <div className="relative aspect-video">
                <video
                  src="/videos/Presentation.mp4"
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Bouton central */}
                <div className="absolute right-0 bottom-6 left-0 z-10 flex justify-center">
                  <Link
                    href="/games/step1"
                    className="inline-block rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    Ouvrir la démo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="avantages" className="mx-auto max-w-6xl px-6 py-12">
        <h3 className="mb-6 text-2xl font-bold">
          Les avantages de la formation
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {advantages.map((adv, i) => (
            <article
              key={i}
              className="rounded-2xl border border-white/6 bg-white/3 p-6 backdrop-blur-sm transition hover:bg-white/5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 text-2xl">
                  {adv.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{adv.title}</h4>
                  <p className="mt-1 text-sm text-slate-300">{adv.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Salary / métiers */}
      <section ref={salarySectionRef} className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/6 bg-gradient-to-br from-slate-800/60 to-slate-700/40 p-6 md:flex-row">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Le métier d’automaticien</h3>
            <p className="mt-2 max-w-xl text-slate-300">
              Les automaticiens conçoivent, programment et maintiennent les
              systèmes automatisés. Une compétence recherchée dans l’industrie
              4.0 avec des opportunités de carrière très variées.
            </p>

            <div className="mt-4 flex items-baseline gap-4">
              <div className="text-4xl font-extrabold text-green-400">
                {salary.toLocaleString()}€
              </div>
              <div className="text-sm text-slate-400">
                Salaire estimé (moyenne) — Europe
              </div>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="rounded-lg border border-white/5 bg-white/3 p-4">
              <h4 className="text-sm font-semibold">
                Pourquoi apprendre l’automatisme ?
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Demande stable dans l’industrie</li>
                <li>Rémunération attractive</li>
                <li>Projets concrets et variés</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-12">
        <h3 className="mb-6 text-2xl font-bold">FAQ</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/6 bg-white/3 p-4"
            >
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <div>
                  <div className="text-sm font-semibold">{f.q}</div>
                  {faqOpen === i && (
                    <div className="mt-2 text-sm text-slate-300">{f.a}</div>
                  )}
                </div>
                <div className="ml-4">
                  <svg
                    className={`h-5 w-5 transform transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-green-600 to-slate-700 p-6 md:flex-row">
          <div>
            <h4 className="text-xl font-bold">Prêt à démarrer ?</h4>
            <p className="mt-1 text-sm text-slate-200">
              Essayez la démo interactive et découvrez comment CodingFactory
              peut booster votre carrière.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/games/step1"
              className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-green-400 transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(34,197,94,0.6)]"
            >
              Tester la démo
            </Link>
            <a
              href="mailto:simon_solutions@outlook.com"
              className="rounded-md border border-white/8 px-4 py-2"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row">
          <div>
            © {new Date().getFullYear()} CodingFactory — Tous droits réservés
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/reglement"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200"
            >
              Règlement / Mentions légales
            </a>
            <a
              href="mailto:simon_solutions@outlook.com"
              className="hover:text-slate-200"
            >
              Contact
            </a>
            <a
              href="https://www.linkedin.com/in/simon-sinnaeve-282611153/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
