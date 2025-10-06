import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'ladder-project.json');

    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Projet ladder sauvegardé.' });
  } catch (error) {
    console.error('Erreur API /ladder/save :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
