<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Inertia\Inertia;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = NewsArticle::published();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'ILIKE', '%' . $request->search . '%')
                  ->orWhere('content', 'ILIKE', '%' . $request->search . '%')
                  ->orWhere('summary', 'ILIKE', '%' . $request->search . '%');
            });
        }

        $articles = $query->latest('published_at')->paginate(12);
        
        return Inertia::render('news/index', [
            'articles' => $articles,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(NewsArticle $article)
    {
        if ($article->status !== 'published') {
            abort(404);
        }

        $relatedArticles = NewsArticle::published()
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->take(3)
            ->get();
        
        return Inertia::render('news/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}