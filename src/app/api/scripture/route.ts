import { NextRequest, NextResponse } from 'next/server';
import { getBooks, getChapter, getTestamentBooks } from '@/services/scripture';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const bookId = searchParams.get('bookId');
    const chapter = searchParams.get('chapter');
    const testament = searchParams.get('testament');

    if (action === 'books') {
      const books = await getBooks();
      return NextResponse.json(books);
    }

    if (action === 'testament-books' && testament) {
      const books = await getTestamentBooks(testament as 'old' | 'new');
      return NextResponse.json(books);
    }

    if (action === 'chapter' && bookId && chapter) {
      const verses = await getChapter(parseInt(bookId), parseInt(chapter));
      return NextResponse.json(verses);
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Scripture API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripture data' },
      { status: 500 }
    );
  }
}
