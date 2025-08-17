@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="mb-8">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('home') }}" class="text-blue">🏠 Beranda</a>
                <span class="text-gray">›</span>
                <a href="{{ route('news.index') }}" class="text-blue">📰 Berita</a>
                <span class="text-gray">›</span>
                <span class="text-gray">{{ Str::limit($article->title, 50) }}</span>
            </div>
        </nav>

        <div class="grid grid-cols-3" style="grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- Main Article -->
            <article class="card">
                <div class="card-body">
                    <!-- Category Badge -->
                    <div class="mb-4">
                        @php
                            $categoryIcon = match($article->category) {
                                'emergency' => '🚨',
                                'training' => '📚',
                                'community' => '🏘️',
                                'equipment' => '🛠️',
                                default => '📰'
                            };
                            $categoryName = match($article->category) {
                                'emergency' => 'Darurat',
                                'training' => 'Pelatihan', 
                                'community' => 'Komunitas',
                                'equipment' => 'Peralatan',
                                default => 'Berita'
                            };
                        @endphp
                        <span class="btn btn-secondary text-sm">{{ $categoryIcon }} {{ $categoryName }}</span>
                    </div>

                    <!-- Title -->
                    <h1 class="heading-1 text-red mb-4">{{ $article->title }}</h1>

                    <!-- Meta Information -->
                    <div class="mb-6 pb-4" style="border-bottom: 2px solid #e5e7eb;">
                        <div class="flex items-center gap-4 text-sm text-gray" style="flex-wrap: wrap;">
                            <span>📅 {{ $article->published_at?->format('d M Y H:i') ?? 'Draft' }}</span>
                            @if($article->author)
                                <span>✍️ {{ $article->author }}</span>
                            @endif
                        </div>
                    </div>

                    <!-- Summary -->
                    @if($article->summary)
                        <div class="bg-blue p-4 mb-6" style="border-radius: 0.5rem;">
                            <p class="text-lg" style="margin: 0; line-height: 1.6;">{{ $article->summary }}</p>
                        </div>
                    @endif

                    <!-- Content -->
                    <div class="prose" style="line-height: 1.8; font-size: 1rem;">
                        {!! nl2br(e($article->content)) !!}
                    </div>
                </div>

                <!-- Share/Actions -->
                <div class="card-footer">
                    <div class="flex justify-between items-center" style="flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <span class="text-sm text-gray">Bagikan:</span>
                            <div class="flex gap-2 mt-2">
                                <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->fullUrl()) }}" 
                                   target="_blank" class="btn btn-primary text-sm">📘 Facebook</a>
                                <a href="https://twitter.com/intent/tweet?url={{ urlencode(request()->fullUrl()) }}&text={{ urlencode($article->title) }}" 
                                   target="_blank" class="btn btn-secondary text-sm">🐦 Twitter</a>
                                <a href="whatsapp://send?text={{ urlencode($article->title . ' - ' . request()->fullUrl()) }}" 
                                   class="btn" style="background: #25D366; color: white;" target="_blank">💬 WhatsApp</a>
                            </div>
                        </div>
                        
                        <a href="{{ route('news.index') }}" class="btn btn-outline">« 📰 Kembali ke Berita</a>
                    </div>
                </div>
            </article>

            <!-- Sidebar -->
            <aside>
                <!-- Related Articles -->
                @if($relatedArticles && $relatedArticles->count() > 0)
                <div class="card mb-6">
                    <div class="card-header">
                        <h3 class="heading-3">📰 Berita Terkait</h3>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        @foreach($relatedArticles as $related)
                        <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                            <h4 class="text-lg font-weight: 600; margin-bottom: 0.5rem;">
                                <a href="{{ route('news.show', $related) }}" class="text-red" style="text-decoration: none;">
                                    {{ $related->title }}
                                </a>
                            </h4>
                            <p class="text-sm text-gray">
                                📅 {{ $related->published_at?->format('d M Y') }}
                            </p>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Emergency Contact -->
                <div class="card">
                    <div class="card-header bg-red">
                        <h3 class="heading-3" style="color: white;">🚨 Kontak Darurat</h3>
                    </div>
                    <div class="card-body">
                        <p class="mb-4">Butuh bantuan segera?</p>
                        <div class="text-center">
                            <a href="tel:113" class="btn btn-primary mb-2" style="width: 100%;">📞 Panggil 113</a>
                            <a href="{{ route('service-requests.create') }}" class="btn btn-secondary" style="width: 100%;">📋 Ajukan Layanan</a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</section>
@endsection