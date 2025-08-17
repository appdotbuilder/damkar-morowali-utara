@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <div class="flex justify-between items-center mb-8" style="flex-wrap: wrap; gap: 1rem;">
            <div>
                <h1 class="heading-1 text-red">📋 Kelola Permohonan Layanan</h1>
                <p class="text-lg text-gray">Daftar permohonan layanan dari masyarakat</p>
            </div>
            <a href="{{ route('service-requests.create') }}" class="btn btn-primary">➕ Permohonan Baru</a>
        </div>

        @if($serviceRequests->count() > 0)
            <!-- Service Requests Table -->
            <div class="card">
                <div class="card-body" style="padding: 0;">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                                <tr>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">No. Tiket</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Pemohon</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Layanan</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Prioritas</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Status</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Tanggal</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($serviceRequests as $request)
                                <tr style="border-bottom: 1px solid #e5e7eb;">
                                    <td style="padding: 1rem;">
                                        <span style="font-weight: 600; color: var(--color-primary-blue);">
                                            {{ $request->ticket_number }}
                                        </span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div>
                                            <div style="font-weight: 600;">{{ $request->requester_name }}</div>
                                            <div class="text-sm text-gray">📞 {{ $request->phone }}</div>
                                        </div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        @php
                                            $serviceTypeText = match($request->service_type) {
                                                'fire_emergency' => '🚨 Darurat',
                                                'fire_prevention' => '🛡️ Pencegahan',
                                                'safety_inspection' => '🔍 Inspeksi',
                                                'training' => '📚 Pelatihan',
                                                'consultation' => '💬 Konsultasi',
                                                'other' => '📝 Lainnya',
                                                default => $request->service_type
                                            };
                                        @endphp
                                        <span class="text-sm">{{ $serviceTypeText }}</span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        @php
                                            $priorityConfig = match($request->priority) {
                                                'low' => ['icon' => '🟢', 'color' => '#10b981'],
                                                'medium' => ['icon' => '🟡', 'color' => '#f59e0b'],
                                                'high' => ['icon' => '🟠', 'color' => '#f97316'],
                                                'emergency' => ['icon' => '🔴', 'color' => '#ef4444'],
                                                default => ['icon' => '⚪', 'color' => '#6b7280']
                                            };
                                        @endphp
                                        <span style="color: {{ $priorityConfig['color'] }}; font-weight: 600;">
                                            {{ $priorityConfig['icon'] }} {{ ucfirst($request->priority) }}
                                        </span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        @php
                                            $statusConfig = match($request->status) {
                                                'pending' => ['text' => 'Menunggu', 'color' => '#f59e0b'],
                                                'in_progress' => ['text' => 'Proses', 'color' => '#3b82f6'],
                                                'completed' => ['text' => 'Selesai', 'color' => '#10b981'],
                                                'cancelled' => ['text' => 'Batal', 'color' => '#ef4444'],
                                                default => ['text' => $request->status, 'color' => '#6b7280']
                                            };
                                        @endphp
                                        <span class="text-sm" style="color: {{ $statusConfig['color'] }}; font-weight: 600;">
                                            {{ $statusConfig['text'] }}
                                        </span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div class="text-sm">
                                            <div>{{ $request->created_at->format('d M Y') }}</div>
                                            <div class="text-gray">{{ $request->created_at->format('H:i') }}</div>
                                        </div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div class="flex gap-2" style="flex-wrap: wrap;">
                                            <a href="{{ route('service-requests.show', $request) }}" 
                                               class="btn btn-outline text-sm">👁️ Lihat</a>
                                            @auth
                                                <a href="{{ route('admin.service-requests.edit', $request) }}" 
                                                   class="btn btn-secondary text-sm">✏️ Edit</a>
                                            @endauth
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pagination -->
                @if($serviceRequests->hasPages())
                <div class="card-footer text-center">
                    <div style="display: inline-flex; gap: 0.5rem; align-items: center;">
                        @if($serviceRequests->onFirstPage())
                            <span class="btn" style="background: #e5e7eb; color: #9ca3af; cursor: not-allowed;">« Sebelumnya</span>
                        @else
                            <a href="{{ $serviceRequests->previousPageUrl() }}" class="btn btn-outline">« Sebelumnya</a>
                        @endif

                        <span class="px-4 py-2">
                            Halaman {{ $serviceRequests->currentPage() }} dari {{ $serviceRequests->lastPage() }}
                        </span>

                        @if($serviceRequests->hasMorePages())
                            <a href="{{ $serviceRequests->nextPageUrl() }}" class="btn btn-outline">Selanjutnya »</a>
                        @else
                            <span class="btn" style="background: #e5e7eb; color: #9ca3af; cursor: not-allowed;">Selanjutnya »</span>
                        @endif
                    </div>
                </div>
                @endif
            </div>
        @else
            <!-- Empty State -->
            <div class="card text-center">
                <div class="card-body py-12">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                    <h3 class="heading-2 mb-4">Belum Ada Permohonan</h3>
                    <p class="text-gray mb-8">Belum ada permohonan layanan yang masuk saat ini.</p>
                    <a href="{{ route('service-requests.create') }}" class="btn btn-primary">📋 Buat Permohonan</a>
                </div>
            </div>
        @endif
    </div>
</section>
@endsection