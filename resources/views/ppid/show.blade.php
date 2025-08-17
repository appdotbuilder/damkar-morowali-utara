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
                <a href="{{ route('ppid.index') }}" class="text-blue">📄 PPID</a>
                <span class="text-gray">›</span>
                <span class="text-gray">{{ $ppidRequest->request_number }}</span>
            </div>
        </nav>

        <div class="text-center mb-8">
            <h1 class="heading-1 text-blue">📄 Detail Permohonan PPID</h1>
            <p class="text-lg text-gray">Nomor Register: <strong>{{ $ppidRequest->request_number }}</strong></p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Status Card -->
            <div class="card mb-6">
                <div class="card-body text-center">
                    @php
                        $statusConfig = match($ppidRequest->status) {
                            'submitted' => ['icon' => '📋', 'text' => 'Diajukan', 'color' => '#f59e0b'],
                            'in_review' => ['icon' => '🔍', 'text' => 'Sedang Ditinjau', 'color' => '#3b82f6'],
                            'approved' => ['icon' => '✅', 'text' => 'Disetujui', 'color' => '#10b981'],
                            'rejected' => ['icon' => '❌', 'text' => 'Ditolak', 'color' => '#ef4444'],
                            'completed' => ['icon' => '🎉', 'text' => 'Selesai', 'color' => '#059669'],
                            default => ['icon' => '📄', 'text' => 'Tidak Diketahui', 'color' => '#6b7280']
                        };
                    @endphp
                    
                    <div style="font-size: 3rem; margin-bottom: 1rem;">{{ $statusConfig['icon'] }}</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: {{ $statusConfig['color'] }}; margin-bottom: 0.5rem;">
                        {{ $statusConfig['text'] }}
                    </div>
                    <div class="text-sm text-gray">Status Permohonan</div>

                    @if($ppidRequest->processed_by && $ppidRequest->processedBy)
                        <div class="mt-4 p-3 bg-blue" style="border-radius: 0.5rem;">
                            <div class="text-sm">👤 Diproses oleh: <strong>{{ $ppidRequest->processedBy->name }}</strong></div>
                        </div>
                    @endif

                    @if($ppidRequest->response_date)
                        <div class="mt-4 p-3 bg-gray" style="border-radius: 0.5rem;">
                            <div class="text-sm">📅 Tanggal Respons: <strong>{{ $ppidRequest->response_date->format('d M Y H:i') }}</strong></div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Requester Information -->
            <div class="card mb-6">
                <div class="card-header">
                    <h2 class="heading-2">👤 Data Pemohon</h2>
                </div>
                <div class="card-body">
                    <div class="grid grid-cols-2">
                        <div>
                            <h3 class="heading-3">Identitas</h3>
                            <p class="mb-2"><strong>Nama:</strong> {{ $ppidRequest->requester_name }}</p>
                            <p class="mb-2">
                                <strong>{{ ucfirst($ppidRequest->identity_type) }}:</strong> 
                                {{ $ppidRequest->identity_number }}
                            </p>
                            <p class="mb-4"><strong>Pekerjaan:</strong> {{ $ppidRequest->job }}</p>

                            <h3 class="heading-3">Kontak</h3>
                            <p class="mb-2">📞 {{ $ppidRequest->phone }}</p>
                            @if($ppidRequest->email)
                                <p class="mb-4">📧 {{ $ppidRequest->email }}</p>
                            @endif
                        </div>

                        <div>
                            <h3 class="heading-3">Alamat</h3>
                            <p class="mb-4">📍 {{ $ppidRequest->address }}</p>

                            <h3 class="heading-3">Tanggal Pengajuan</h3>
                            <p class="mb-4">📅 {{ $ppidRequest->created_at->format('d M Y H:i') }}</p>

                            <h3 class="heading-3">Cara Penyampaian</h3>
                            <p class="mb-4">
                                @php
                                    $deliveryMethod = match($ppidRequest->delivery_method) {
                                        'email' => '📧 Email',
                                        'hardcopy' => '📄 Hardcopy',
                                        'postal' => '📮 Pos/Kurir',
                                        'digital' => '💾 Media Digital',
                                        default => $ppidRequest->delivery_method
                                    };
                                @endphp
                                {{ $deliveryMethod }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Request Information -->
            <div class="card mb-6">
                <div class="card-header">
                    <h2 class="heading-2">📋 Detail Informasi yang Diminta</h2>
                </div>
                <div class="card-body">
                    <div class="mb-4">
                        <h3 class="heading-3">Jenis Informasi</h3>
                        <p class="mb-4">
                            @php
                                $informationType = match($ppidRequest->information_type) {
                                    'regular' => '📄 Informasi Berkala',
                                    'immediate' => '⚡ Informasi Serta Merta',
                                    'on_demand' => '📋 Informasi Setiap Saat',
                                    default => $ppidRequest->information_type
                                };
                            @endphp
                            {{ $informationType }}
                        </p>
                    </div>

                    <div class="mb-4">
                        <h3 class="heading-3">Rincian Informasi</h3>
                        <div class="bg-gray p-4" style="border-radius: 0.5rem;">
                            <p style="margin: 0; white-space: pre-wrap;">{{ $ppidRequest->information_details }}</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="heading-3">Tujuan Penggunaan</h3>
                        <div class="bg-blue p-4" style="border-radius: 0.5rem;">
                            <p style="margin: 0; white-space: pre-wrap;">{{ $ppidRequest->purpose }}</p>
                        </div>
                    </div>

                    @if($ppidRequest->response_text)
                        <div class="mb-4">
                            <h3 class="heading-3">Respons PPID</h3>
                            <div class="bg-red p-4" style="border-radius: 0.5rem; border-left: 4px solid var(--color-primary-red);">
                                <p style="margin: 0; white-space: pre-wrap; color: #1f2937;">{{ $ppidRequest->response_text }}</p>
                            </div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center mb-6">
                <div class="flex justify-center gap-4" style="flex-wrap: wrap;">
                    <a href="{{ route('ppid.create') }}" class="btn btn-primary">📋 Ajukan Permohonan Baru</a>
                    <a href="{{ route('ppid.index') }}" class="btn btn-outline">📄 Info PPID</a>
                    <a href="{{ route('home') }}" class="btn btn-outline">🏠 Kembali ke Beranda</a>
                </div>
            </div>

            <!-- Information Card -->
            <div class="card">
                <div class="card-body text-center">
                    <h3 class="heading-3">ℹ️ Informasi Penting</h3>
                    <p class="text-gray mb-4">
                        Simpan nomor register <strong>{{ $ppidRequest->request_number }}</strong> sebagai bukti permohonan. 
                        Anda dapat menghubungi PPID jika memerlukan informasi lebih lanjut mengenai status permohonan.
                    </p>
                    <div class="grid grid-cols-2">
                        <div>
                            <h4 class="heading-3 text-blue">📞 Kontak PPID</h4>
                            <p class="text-sm text-gray mb-2">Telepon: (021) 123-4567</p>
                            <p class="text-sm text-gray">Email: ppid@damkar.go.id</p>
                        </div>
                        <div>
                            <h4 class="heading-3 text-blue">⏰ Waktu Proses</h4>
                            <p class="text-sm text-gray mb-2">Maksimal: 10 hari kerja</p>
                            <p class="text-sm text-gray">Dapat diperpanjang 7 hari</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection