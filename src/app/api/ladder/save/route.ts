import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, filename } = body;

    // Créer le dossier 'saves' s'il n'existe pas
    const savesDir = path.join(process.cwd(), 'saves');
    await mkdir(savesDir, { recursive: true });

    const filePath = path.join(savesDir, `${filename}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Projet sauvegardé.' });
  } catch (error) {
    console.error('Erreur API /ladder/save :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
