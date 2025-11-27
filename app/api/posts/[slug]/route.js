import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    // Await params before accessing properties
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    console.log('API: Looking for slug:', slug);
    
    const client = await clientPromise;
    const db = client.db('blog');
    
    const post = await db
      .collection('posts')
      .findOne({ slug: slug, published: true });
    
    if (!post) {
      console.log('API: Post not found for slug:', slug);
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      );
    }
    
    console.log('API: Post found:', post.title);
    return NextResponse.json(post);
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: e.message }, 
      { status: 500 }
    );
  }
}