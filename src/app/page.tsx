import Title from '@/components/atoms/Title';
import Button from '@/components/atoms/Button';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Title>Bienvenue sur Code Factory 🎉</Title>
      <Button href="/game" icon={'play'}>
        Accéder au jeu
      </Button>
    </main>
  );
}
