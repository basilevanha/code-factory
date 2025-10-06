import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'ladder-project.json');
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);
    return NextResponse.json(json);
  } catch (error) {
    console.error('Erreur API /ladder/load :', error);
    return NextResponse.json(
      { error: 'Aucun ladder sauvegardé.' },
      { status: 404 }
    );
  }
}
