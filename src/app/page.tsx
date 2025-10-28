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
      { threshold: 0.4 } // au moins 40% visible
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
      q: 'Faut-il avoir déjà utilisé TIA Portal, GXprogrammer,EcoStruxure... ?',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* Fixed header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-slate-700 to-slate-600 shadow-md">
              <Image
                src="/image/logo-Technical Solutions.png"
                alt="Coding Factory Logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                CodingFactory
              </h1>
              <p className="-mt-0.5 text-xs text-slate-400">
                Programmation industrielle • Automatisme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/games/step1"
              className="hidden rounded-md border border-cyan-500 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/10 md:inline-block"
            >
              Tester la démo
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-white/6 px-3 py-1.5 text-sm backdrop-blur-sm backdrop-filter hover:bg-white/8"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Lowpoly/industrial background */}
      <div className="relative overflow-hidden pt-20">
        <svg
          className="pointer-events-none absolute top-0 right-0 opacity-30"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#0ea5a4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polygon
            points="300,0 600,150 450,400 150,350 0,150"
            fill="url(#g1)"
          />
        </svg>

        {/* Hero */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Texte à gauche */}
            <div>
              <p className="mb-3 text-sm font-medium text-cyan-400 uppercase">
                Nouveau · Formation interactive
              </p>

              <h2 className="text-4xl leading-tight font-extrabold md:text-5xl">
                Programme ton premier automate en moins de 10&nbsp;minutes
              </h2>

              <p className="mt-4 max-w-xl text-slate-300">
                Plonge dans <strong>Coding Factory</strong> — un monde 3D
                interactif où tu apprends à
                <strong> programmer des usines </strong> par la pratique et le
                jeu. Aucun logiciel à installer, aucun prérequis :
                <strong>
                  {' '}
                  progresse pas à pas jusqu’à ton premier projet fonctionnel.
                </strong>
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/games/step1"
                  className="inline-flex items-center gap-3 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.03]"
                >
                  🎮 Tester la démo
                </Link>
                <a
                  href="#avantages"
                  className="text-sm text-slate-300 underline hover:text-cyan-400"
                >
                  Voir pourquoi ça marche
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Inspiré de l'industrie · 100% interactif
              </p>

              {/* Preuves et bénéfices rapides */}
              <div className="mt-8 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  Résultats visibles dès le début
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                  Environnement 3D interactif
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  Aucun logiciel à installer
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
                  Certification disponible
                </div>
              </div>
            </div>

            {/* Vidéo démo */}
            <div className="relative">
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-800/70 to-slate-700/60 p-4 shadow-xl">
                <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl md:h-72">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                    src="/videos/Presentation.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute right-0 bottom-6 left-0 z-10 flex justify-center">
                    <Link
                      href="/games/step1"
                      className="inline-block rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      Ouvrir la démo
                    </Link>
                  </div>
                </div>

                {/* Lignes techniques */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-100">
                      Ladder
                    </div>
                    <div className="mt-1">Logique temps réel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-100">
                      3D
                    </div>
                    <div className="mt-1">Simulation lowpoly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-100">
                      Web
                    </div>
                    <div className="mt-1">Aucune installation</div>
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
        <section
          ref={salarySectionRef}
          className="mx-auto max-w-6xl px-6 py-12"
        >
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/6 bg-gradient-to-br from-slate-800/60 to-slate-700/40 p-6 md:flex-row">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Le métier d’automaticien</h3>
              <p className="mt-2 max-w-xl text-slate-300">
                Les automaticiens conçoivent, programment et maintiennent les
                systèmes automatisés. Une compétence recherchée dans l’industrie
                4.0 avec des opportunités de carrière très variées.
              </p>

              <div className="mt-4 flex items-baseline gap-4">
                <div className="text-4xl font-extrabold text-cyan-400">
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
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-cyan-600 to-slate-700 p-6 md:flex-row">
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
                className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-cyan-400"
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
    </div>
  );
}
