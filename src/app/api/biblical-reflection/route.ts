import { NextRequest, NextResponse } from 'next/server';
import { biblicalPassageReflection } from '@/ai/flows/biblical-passage-reflection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedText, context } = body;

    if (!selectedText || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: selectedText and context' },
        { status: 400 }
      );
    }

    const result = await biblicalPassageReflection({
      selectedText,
      context,
    });

    return NextResponse.json({ 
      reflection: result.explanation // Keep "reflection" for backward compatibility with frontend
    });
  } catch (error) {
    console.error('Biblical reflection API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate biblical reflection' },
      { status: 500 }
    );
  }
}
