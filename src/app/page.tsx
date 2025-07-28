// Components
import GameCard from '@/components/molecules/GameCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-semibold">
          Bienvenue sur Code Factory 🎉
        </h1>
        <p className="mb-10 text-gray-600">
          Une collection de mini-jeux pour apprendre, s'amuser et expérimenter.
        </p>

        <ul className="space-y-4">
          <GameCard
            title="Jeu démonstration"
            description="Découvre les mécaniques de base."
            href="/games/demo"
            icon="▶️"
          />
          <GameCard
            title="Niveau 2"
            description="En construction..."
            disabled
            icon="🛠️"
          />
          <GameCard
            title="Niveau 3"
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
