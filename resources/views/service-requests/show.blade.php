@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <!-- Success Message -->
        @if(session('success'))
            <div class="card mb-6 bg-blue">
                <div class="card-body text-center">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                    <p style="font-weight: 600; margin: 0;">{{ session('success') }}</p>
                </div>
            </div>
        @endif

        <!-- Breadcrumb -->
        <nav class="mb-8">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('home') }}" class="text-blue">🏠 Beranda</a>
                <span class="text-gray">›</span>
                <a href="{{ route('service-requests.create') }}" class="text-blue">📋 Layanan</a>
                <span class="text-gray">›</span>
                <span class="text-gray">{{ $serviceRequest->ticket_number }}</span>
            </div>
        </nav>

        <div class="text-center mb-8">
            <h1 class="heading-1 text-red">📋 Detail Permohonan Layanan</h1>
            <p class="text-lg text-gray">Nomor Tiket: <strong>{{ $serviceRequest->ticket_number }}</strong></p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Status Card -->
            <div class="card mb-6">
                <div class="card-body text-center">
                    @php
                        $statusConfig = match($serviceRequest->status) {
                            'pending' => ['icon' => '🕐', 'text' => 'Menunggu', 'color' => '#f59e0b'],
                            'in_progress' => ['icon' => '🔄', 'text' => 'Dalam Proses', 'color' => '#3b82f6'],
                            'completed' => ['icon' => '✅', 'text' => 'Selesai', 'color' => '#10b981'],
                            'cancelled' => ['icon' => '❌', 'text' => 'Dibatalkan', 'color' => '#ef4444'],
                            default => ['icon' => '📋', 'text' => 'Tidak Diketahui', 'color' => '#6b7280']
                        };
                        
                        $priorityConfig = match($serviceRequest->priority) {
                            'low' => ['icon' => '🟢', 'text' => 'Rendah', 'color' => '#10b981'],
                            'medium' => ['icon' => '🟡', 'text' => 'Sedang', 'color' => '#f59e0b'],
                            'high' => ['icon' => '🟠', 'text' => 'Tinggi', 'color' => '#f97316'],
                            'emergency' => ['icon' => '🔴', 'text' => 'Darurat', 'color' => '#ef4444'],
                            default => ['icon' => '⚪', 'text' => 'Tidak Diketahui', 'color' => '#6b7280']
                        };
                    @endphp
                    
                    <div class="grid grid-cols-2 mb-4">
                        <div>
                            <div style="font-size: 2rem;">{{ $statusConfig['icon'] }}</div>
                            <div style="font-weight: 600; color: {{ $statusConfig['color'] }};">
                                {{ $statusConfig['text'] }}
                            </div>
                            <div class="text-sm text-gray">Status</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem;">{{ $priorityConfig['icon'] }}</div>
                            <div style="font-weight: 600; color: {{ $priorityConfig['color'] }};">
                                {{ $priorityConfig['text'] }}
                            </div>
                            <div class="text-sm text-gray">Prioritas</div>
                        </div>
                    </div>

                    @if($serviceRequest->assigned_to && $serviceRequest->assignedTo)
                        <div class="mt-4 p-3 bg-blue" style="border-radius: 0.5rem;">
                            <div class="text-sm">👤 Ditangani oleh: <strong>{{ $serviceRequest->assignedTo->name }}</strong></div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Service Details -->
            <div class="card mb-6">
                <div class="card-header">
                    <h2 class="heading-2">📝 Detail Layanan</h2>
                </div>
                <div class="card-body">
                    <div class="grid grid-cols-2">
                        <div>
                            <h3 class="heading-3">Jenis Layanan</h3>
                            <p class="mb-4">
                                @php
                                    $serviceTypeText = match($serviceRequest->service_type) {
                                        'fire_emergency' => '🚨 Darurat Kebakaran',
                                        'fire_prevention' => '🛡️ Pencegahan Kebakaran', 
                                        'safety_inspection' => '🔍 Inspeksi Keselamatan',
                                        'training' => '📚 Pelatihan K3',
                                        'consultation' => '💬 Konsultasi',
                                        'other' => '📝 Lainnya',
                                        default => $serviceRequest->service_type
                                    };
                                @endphp
                                {{ $serviceTypeText }}
                            </p>

                            <h3 class="heading-3">Tanggal Pengajuan</h3>
                            <p class="mb-4">📅 {{ $serviceRequest->created_at->format('d M Y H:i') }}</p>

                            @if($serviceRequest->scheduled_date)
                                <h3 class="heading-3">Tanggal Terjadwal</h3>
                                <p class="mb-4">📅 {{ $serviceRequest->scheduled_date->format('d M Y H:i') }}</p>
                            @endif
                        </div>

                        <div>
                            <h3 class="heading-3">Pemohon</h3>
                            <p class="mb-4">👤 {{ $serviceRequest->requester_name }}</p>

                            <h3 class="heading-3">Kontak</h3>
                            <p class="mb-2">📞 {{ $serviceRequest->phone }}</p>
                            @if($serviceRequest->email)
                                <p class="mb-4">📧 {{ $serviceRequest->email }}</p>
                            @endif

                            @if($serviceRequest->completion_date)
                                <h3 class="heading-3">Tanggal Selesai</h3>
                                <p class="mb-4">✅ {{ $serviceRequest->completion_date->format('d M Y H:i') }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="mt-6">
                        <h3 class="heading-3">Alamat</h3>
                        <p class="mb-4">📍 {{ $serviceRequest->address }}</p>

                        <h3 class="heading-3">Deskripsi</h3>
                        <div class="bg-gray p-4" style="border-radius: 0.5rem;">
                            <p style="margin: 0; white-space: pre-wrap;">{{ $serviceRequest->description }}</p>
                        </div>

                        @if($serviceRequest->notes)
                            <h3 class="heading-3 mt-6">Catatan</h3>
                            <div class="bg-blue p-4" style="border-radius: 0.5rem;">
                                <p style="margin: 0; white-space: pre-wrap;">{{ $serviceRequest->notes }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center">
                <div class="flex justify-center gap-4" style="flex-wrap: wrap;">
                    <a href="{{ route('service-requests.create') }}" class="btn btn-primary">📋 Ajukan Layanan Baru</a>
                    <a href="{{ route('home') }}" class="btn btn-outline">🏠 Kembali ke Beranda</a>
                    @if($serviceRequest->priority === 'emergency')
                        <a href="tel:113" class="btn btn-secondary">📞 Hubungi 113</a>
                    @endif
                </div>
            </div>

            <!-- Information Card -->
            <div class="card mt-6">
                <div class="card-body text-center">
                    <h3 class="heading-3">ℹ️ Informasi</h3>
                    <p class="text-gray mb-4">
                        Simpan nomor tiket <strong>{{ $serviceRequest->ticket_number }}</strong> untuk referensi. 
                        Anda dapat menghubungi kami jika ada pertanyaan atau update diperlukan.
                    </p>
                    <div class="flex justify-center gap-4" style="flex-wrap: wrap;">
                        <a href="tel:113" class="btn btn-outline">📞 Hubungi Kami</a>
                        <a href="{{ route('news.index') }}" class="btn btn-outline">📰 Lihat Berita</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection