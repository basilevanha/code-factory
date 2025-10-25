export default function ReglementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100 antialiased">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-center text-3xl font-bold text-blue-400">
          Règlement et Conditions d’utilisation
        </h1>

        <p className="text-center text-slate-300">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <section className="space-y-4 leading-relaxed">
          <h2 className="text-xl font-semibold text-blue-300">
            1. Objet du service
          </h2>
          <p>
            Coding Factory est une plateforme de formation en ligne destinée à
            l’apprentissage de l’automatisation industrielle, de la
            programmation et des techniques associées. L’accès à la plateforme
            implique l’acceptation sans réserve du présent règlement.
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            2. Accès et comptes utilisateurs
          </h2>
          <p>
            L’inscription est personnelle. Vous êtes responsable de la
            confidentialité de vos identifiants. Toute activité réalisée depuis
            votre compte est réputée être effectuée par vous.
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            3. Utilisation du contenu
          </h2>
          <p>
            Les vidéos, exercices, scènes 3D et supports pédagogiques mis à
            disposition sur Coding Factory sont protégés par le droit d’auteur.
            Toute reproduction, distribution ou revente non autorisée est
            strictement interdite.
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            4. Données personnelles (RGPD)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (UE
            2016/679), les informations collectées sont utilisées uniquement
            pour la gestion de votre compte et l’amélioration du service. Vous
            pouvez à tout moment demander la suppression ou la rectification de
            vos données via l’adresse suivante :{' '}
            <a
              href="mailto:simon_solutions@outlook.com"
              className="text-blue-400 underline hover:text-blue-300"
            >
              simon_solutions@outlook.com
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            5. Responsabilité
          </h2>
          <p>
            Coding Factory met tout en œuvre pour garantir la qualité et la
            disponibilité du service. Cependant, la plateforme ne saurait être
            tenue responsable en cas d’interruption, d’erreur technique ou de
            perte de données indépendantes de sa volonté.
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            6. Résiliation
          </h2>
          <p>
            Vous pouvez à tout moment demander la suppression de votre compte.
            En cas d’abus, Coding Factory se réserve le droit de suspendre un
            compte sans préavis.
          </p>

          <h2 className="text-xl font-semibold text-blue-300">
            7. Droit applicable
          </h2>
          <p>
            Le présent règlement est soumis au droit belge et au droit européen
            applicable. En cas de litige, les tribunaux compétents seront ceux
            du ressort du siège de l’éditeur.
          </p>
        </section>

        <footer className="pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Coding Factory. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}
