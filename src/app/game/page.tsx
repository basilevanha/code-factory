import Button from '@/components/atoms/Button';
import Title from '@/components/atoms/Title';
import UnityWrapper from '@/components/organisms/UnityWrapper';

export default function GamePage() {
  return (
    <div className="flex flex-col items-center">
      <Title>Page de jeu</Title>
      <Button href="/" icon="chevron-left">
        Retour à l'accueil
      </Button>
      <div className="mt-8 w-full max-w-3xl">
        <UnityWrapper buildPath={'/unity-test'} />
      </div>
    </div>
  );
}
