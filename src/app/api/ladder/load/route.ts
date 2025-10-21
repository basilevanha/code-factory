import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    const savesDir = path.join(process.cwd(), 'saves');
    const filePath = path.join(savesDir, `${filename}.json`);

    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);

    return NextResponse.json(json);
  } catch (error) {
    console.error('Erreur API /ladder/load :', error);
    return NextResponse.json({ error: 'Fichier non trouvé.' }, { status: 404 });
  }
}
