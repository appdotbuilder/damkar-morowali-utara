@extends('layouts.app')

@section('content')
<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <h1>🚒 Dinas Pemadam Kebakaran</h1>
        <p>Melayani dan Melindungi Masyarakat dengan Dedikasi Tinggi</p>
        <div class="flex justify-center gap-4" style="justify-content: center; flex-wrap: wrap;">
            <a href="{{ route('service-requests.create') }}" class="btn btn-white">📞 Layanan Darurat</a>
            <a href="{{ route('news.index') }}" class="btn btn-outline" style="border-color: white; color: white;">📰 Berita Terkini</a>
        </div>
    </div>
</section>

<!-- Statistics Section -->
<section class="py-12 bg-gray">
    <div class="container">
        <div class="text-center mb-8">
            <h2 class="heading-2">📊 Statistik Layanan</h2>
            <p class="text-gray">Data kinerja pelayanan kami</p>
        </div>
        
        <div class="grid grid-cols-4">
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔥</div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-red);">
                        {{ number_format($statistics['total_incidents'] ?? 0) }}
                    </div>
                    <div class="text-gray text-sm">Total Insiden</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📅</div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-blue);">
                        {{ number_format($statistics['incidents_this_month'] ?? 0) }}
                    </div>
                    <div class="text-gray text-sm">Insiden Bulan Ini</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-red);">
                        {{ number_format($statistics['active_stations'] ?? 0) }}
                    </div>
                    <div class="text-gray text-sm">Pos Pemadam</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏱️</div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-blue);">
                        {{ number_format($statistics['avg_response_time'] ?? 0, 1) }}
                    </div>
                    <div class="text-gray text-sm">Menit Respons</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Latest News Section -->
@if($latestNews && $latestNews->count() > 0)
<section class="py-12">
    <div class="container">
        <div class="text-center mb-8">
            <h2 class="heading-2 text-red">📰 Berita Terkini</h2>
            <p class="text-gray">Informasi dan update terbaru dari dinas</p>
        </div>
        
        <div class="grid grid-cols-3">
            @foreach($latestNews->take(6) as $article)
            <article class="card">
                <div class="card-body">
                    <h3 class="heading-3">{{ $article->title }}</h3>
                    <p class="text-gray text-sm mb-2">
                        📅 {{ $article->published_at?->format('d M Y') ?? 'Draft' }}
                    </p>
                    <p class="text-gray mb-4">{{ Str::limit($article->excerpt, 120) }}</p>
                    <a href="{{ route('news.show', $article) }}" class="btn btn-outline">Baca Selengkapnya</a>
                </div>
            </article>
            @endforeach
        </div>
        
        <div class="text-center mt-8">
            <a href="{{ route('news.index') }}" class="btn btn-primary">📰 Lihat Semua Berita</a>
        </div>
    </div>
</section>
@endif

<!-- Recent Incidents Section -->
@if($recentIncidents && $recentIncidents->count() > 0)
<section class="py-12 bg-red">
    <div class="container">
        <div class="text-center mb-8">
            <h2 class="heading-2">🚨 Insiden Terkini</h2>
            <p class="text-gray">Laporan kejadian darurat terbaru</p>
        </div>
        
        <div class="grid grid-cols-3">
            @foreach($recentIncidents->take(3) as $incident)
            <div class="card">
                <div class="card-body">
                    <div class="flex items-center mb-2">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem;">🔥</span>
                        <h3 class="heading-3">{{ $incident->type }}</h3>
                    </div>
                    <p class="text-gray text-sm mb-2">
                        📍 {{ $incident->location }}
                    </p>
                    <p class="text-gray text-sm mb-2">
                        📅 {{ $incident->incident_date?->format('d M Y H:i') }}
                    </p>
                    @if($incident->response_time_minutes)
                    <p class="text-sm">
                        ⏱️ <strong>Waktu Respons:</strong> {{ $incident->response_time_minutes }} menit
                    </p>
                    @endif
                </div>
                <div class="card-footer">
                    <span class="text-sm font-weight: 600;
                        @if($incident->status === 'resolved') color: #059669;
                        @elseif($incident->status === 'in_progress') color: #d97706;
                        @else color: #dc2626;
                        @endif">
                        @if($incident->status === 'resolved') ✅ Selesai
                        @elseif($incident->status === 'in_progress') 🔄 Dalam Proses
                        @else 🚨 Darurat
                        @endif
                    </span>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- Fire Stations Section -->
@if($fireStations && $fireStations->count() > 0)
<section class="py-12">
    <div class="container">
        <div class="text-center mb-8">
            <h2 class="heading-2 text-blue">🏢 Pos Pemadam</h2>
            <p class="text-gray">Lokasi pos pemadam kebakaran aktif</p>
        </div>
        
        <div class="grid grid-cols-2">
            @foreach($fireStations->take(4) as $station)
            <div class="card">
                <div class="card-body">
                    <div class="flex items-center mb-2">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem;">🚒</span>
                        <h3 class="heading-3">{{ $station->name }}</h3>
                    </div>
                    <p class="text-gray mb-2">
                        📍 {{ $station->address }}
                    </p>
                    <p class="text-gray text-sm mb-2">
                        📞 {{ $station->phone ?: 'Tidak tersedia' }}
                    </p>
                    <p class="text-sm">
                        👥 <strong>{{ $station->staff_count ?? 0 }} personel</strong>
                    </p>
                </div>
                <div class="card-footer">
                    <span class="text-sm" style="color: #059669; font-weight: 600;">
                        ✅ Aktif 24 Jam
                    </span>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- Emergency Services CTA -->
<section class="py-12 bg-blue">
    <div class="container text-center">
        <h2 class="heading-2">🚨 Layanan Darurat</h2>
        <p class="text-lg mb-8">Butuh bantuan segera? Hubungi kami atau ajukan permohonan layanan</p>
        
        <div class="flex justify-center gap-4" style="justify-content: center; flex-wrap: wrap;">
            <a href="tel:113" class="btn btn-primary" style="font-size: 1.1rem;">📞 Panggil 113</a>
            <a href="{{ route('service-requests.create') }}" class="btn btn-secondary">📋 Ajukan Layanan</a>
            <a href="{{ route('ppid.index') }}" class="btn btn-outline">📄 Informasi Publik</a>
        </div>
    </div>
</section>
@endsection