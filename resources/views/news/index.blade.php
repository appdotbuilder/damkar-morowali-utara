@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <div class="text-center mb-8">
            <h1 class="heading-1 text-red">📰 Berita Pemadam Kebakaran</h1>
            <p class="text-lg text-gray">Informasi terkini seputar kegiatan dan layanan kami</p>
        </div>

        <!-- Search and Filter -->
        <div class="card mb-8">
            <div class="card-body">
                <form method="GET" action="{{ route('news.index') }}" class="flex gap-4" style="flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <input 
                            type="text" 
                            name="search" 
                            placeholder="🔍 Cari berita..." 
                            value="{{ $filters['search'] ?? '' }}"
                            class="form-input"
                        >
                    </div>
                    <div>
                        <select name="category" class="form-select">
                            <option value="">Semua Kategori</option>
                            <option value="emergency" {{ ($filters['category'] ?? '') === 'emergency' ? 'selected' : '' }}>
                                🚨 Darurat
                            </option>
                            <option value="training" {{ ($filters['category'] ?? '') === 'training' ? 'selected' : '' }}>
                                📚 Pelatihan
                            </option>
                            <option value="community" {{ ($filters['category'] ?? '') === 'community' ? 'selected' : '' }}>
                                🏘️ Komunitas
                            </option>
                            <option value="equipment" {{ ($filters['category'] ?? '') === 'equipment' ? 'selected' : '' }}>
                                🛠️ Peralatan
                            </option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">🔍 Cari</button>
                    @if($filters['search'] ?? $filters['category'] ?? false)
                        <a href="{{ route('news.index') }}" class="btn btn-outline">❌ Reset</a>
                    @endif
                </form>
            </div>
        </div>

        @if($articles->count() > 0)
            <!-- Articles Grid -->
            <div class="grid grid-cols-3">
                @foreach($articles as $article)
                <article class="card">
                    <div class="card-body">
                        <div class="mb-2">
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
                            <span class="text-sm text-blue">{{ $categoryIcon }} {{ $categoryName }}</span>
                        </div>
                        
                        <h3 class="heading-3">{{ $article->title }}</h3>
                        
                        <p class="text-gray text-sm mb-2">
                            📅 {{ $article->published_at?->format('d M Y H:i') ?? 'Draft' }}
                        </p>
                        
                        @if($article->summary)
                            <p class="text-gray mb-4">{{ Str::limit($article->summary, 120) }}</p>
                        @else
                            <p class="text-gray mb-4">{{ Str::limit(strip_tags($article->content), 120) }}</p>
                        @endif
                    </div>
                    
                    <div class="card-footer">
                        <a href="{{ route('news.show', $article) }}" class="btn btn-outline">📖 Baca Selengkapnya</a>
                    </div>
                </article>
                @endforeach
            </div>

            <!-- Pagination -->
            @if($articles->hasPages())
            <div class="mt-8 text-center">
                <div style="display: inline-flex; gap: 0.5rem; align-items: center;">
                    @if($articles->onFirstPage())
                        <span class="btn" style="background: #e5e7eb; color: #9ca3af; cursor: not-allowed;">« Sebelumnya</span>
                    @else
                        <a href="{{ $articles->previousPageUrl() }}" class="btn btn-outline">« Sebelumnya</a>
                    @endif

                    <span class="px-4 py-2">
                        Halaman {{ $articles->currentPage() }} dari {{ $articles->lastPage() }}
                    </span>

                    @if($articles->hasMorePages())
                        <a href="{{ $articles->nextPageUrl() }}" class="btn btn-outline">Selanjutnya »</a>
                    @else
                        <span class="btn" style="background: #e5e7eb; color: #9ca3af; cursor: not-allowed;">Selanjutnya »</span>
                    @endif
                </div>
            </div>
            @endif
        @else
            <!-- Empty State -->
            <div class="text-center py-12">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📰</div>
                <h3 class="heading-2 mb-4">Tidak Ada Berita</h3>
                <p class="text-gray mb-8">
                    @if($filters['search'] ?? $filters['category'] ?? false)
                        Tidak ditemukan berita yang sesuai dengan pencarian Anda.
                    @else
                        Belum ada berita yang dipublikasikan saat ini.
                    @endif
                </p>
                @if($filters['search'] ?? $filters['category'] ?? false)
                    <a href="{{ route('news.index') }}" class="btn btn-primary">🏠 Lihat Semua Berita</a>
                @endif
            </div>
        @endif
    </div>
</section>
@endsection