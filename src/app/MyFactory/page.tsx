// Components
import GameCard from '@/components/molecules/GameCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-16 text-slate-100 antialiased">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Bienvenue sur Coding Factory 🎉
        </h1>
        <p className="mb-10 text-center text-slate-300">
          Une collection de défis pour apprendre, s'amuser et expérimenter sur
          la programmation industrielle.
        </p>

        <ul className="flex flex-col gap-6">
          <GameCard
            title="Parcours de démonstration"
            description="Découvre les mécaniques de base."
            href="games/step1"
            icon="▶️"
          />
          <GameCard
            title="Niveau 2"
            description="En construction..."
            disabled
            icon="🛠️"
          />
          <GameCard
            title="Les bases du LADDER"
            description="En construction..."
            disabled
            icon="🛠️"
          />
          <GameCard
            title="Niveau 4"
            description="En construction..."
            disabled
            icon="🛠️"
          />
        </ul>
      </div>
    </main>
  );
}
