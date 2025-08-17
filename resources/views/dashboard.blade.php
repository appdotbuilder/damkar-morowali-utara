@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <div class="text-center mb-8">
            <h1 class="heading-1 text-red">🏛️ Dashboard Admin</h1>
            <p class="text-lg text-gray">Selamat datang, {{ auth()->user()->name }}!</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-4 mb-8">
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary-blue);">
                        {{ \App\Models\ServiceRequest::count() }}
                    </div>
                    <div class="text-gray text-sm">Permohonan Layanan</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary-red);">
                        {{ \App\Models\PpidRequest::count() }}
                    </div>
                    <div class="text-gray text-sm">Permohonan PPID</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📰</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary-blue);">
                        {{ \App\Models\NewsArticle::count() }}
                    </div>
                    <div class="text-gray text-sm">Artikel Berita</div>
                </div>
            </div>
            
            <div class="card text-center">
                <div class="card-body">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔥</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary-red);">
                        {{ \App\Models\FireIncident::count() }}
                    </div>
                    <div class="text-gray text-sm">Insiden Kebakaran</div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-3 mb-8">
            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📋 Kelola Layanan</h2>
                </div>
                <div class="card-body">
                    <p class="text-gray mb-4">Kelola permohonan layanan dari masyarakat</p>
                    <a href="{{ route('admin.service-requests.index') }}" class="btn btn-primary" style="width: 100%;">
                        📋 Lihat Permohonan
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📄 Kelola PPID</h2>
                </div>
                <div class="card-body">
                    <p class="text-gray mb-4">Proses permohonan informasi publik</p>
                    <a href="#" class="btn btn-secondary" style="width: 100%;">
                        📄 Kelola PPID
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📰 Kelola Berita</h2>
                </div>
                <div class="card-body">
                    <p class="text-gray mb-4">Publikasi berita dan informasi</p>
                    <a href="#" class="btn btn-outline" style="width: 100%;">
                        📰 Kelola Berita
                    </a>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-2">
            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📋 Permohonan Layanan Terbaru</h2>
                </div>
                <div class="card-body" style="padding: 0;">
                    @php
                        $recentServices = \App\Models\ServiceRequest::latest()->take(5)->get();
                    @endphp
                    
                    @forelse($recentServices as $service)
                        <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                            <div class="flex justify-between items-start" style="margin-bottom: 0.5rem;">
                                <h4 style="font-weight: 600;">{{ $service->requester_name }}</h4>
                                <span class="text-sm text-gray">{{ $service->created_at->diffForHumans() }}</span>
                            </div>
                            <p class="text-sm text-gray mb-2">{{ $service->service_type }}</p>
                            <span class="text-sm" style="
                                @if($service->status === 'completed') color: #059669;
                                @elseif($service->status === 'in_progress') color: #d97706;
                                @else color: #dc2626;
                                @endif
                            ">
                                {{ ucfirst($service->status) }}
                            </span>
                        </div>
                    @empty
                        <div style="padding: 2rem; text-center; color: #6b7280;">
                            Belum ada permohonan layanan
                        </div>
                    @endforelse
                </div>
                
                @if($recentServices->count() > 0)
                    <div class="card-footer">
                        <a href="{{ route('admin.service-requests.index') }}" class="text-blue">Lihat Semua →</a>
                    </div>
                @endif
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📄 Permohonan PPID Terbaru</h2>
                </div>
                <div class="card-body" style="padding: 0;">
                    @php
                        $recentPpid = \App\Models\PpidRequest::latest()->take(5)->get();
                    @endphp
                    
                    @forelse($recentPpid as $ppid)
                        <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                            <div class="flex justify-between items-start" style="margin-bottom: 0.5rem;">
                                <h4 style="font-weight: 600;">{{ $ppid->requester_name }}</h4>
                                <span class="text-sm text-gray">{{ $ppid->created_at->diffForHumans() }}</span>
                            </div>
                            <p class="text-sm text-gray mb-2">{{ $ppid->information_type }}</p>
                            <span class="text-sm" style="
                                @if($ppid->status === 'completed') color: #059669;
                                @elseif($ppid->status === 'approved') color: #059669;
                                @elseif($ppid->status === 'in_review') color: #d97706;
                                @else color: #dc2626;
                                @endif
                            ">
                                {{ ucfirst($ppid->status) }}
                            </span>
                        </div>
                    @empty
                        <div style="padding: 2rem; text-center; color: #6b7280;">
                            Belum ada permohonan PPID
                        </div>
                    @endforelse
                </div>
                
                @if($recentPpid->count() > 0)
                    <div class="card-footer">
                        <a href="#" class="text-blue">Lihat Semua →</a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</section>
@endsection