@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="mb-8">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('dashboard') }}" class="text-blue">🏛️ Dashboard</a>
                <span class="text-gray">›</span>
                <a href="{{ route('admin.service-requests.index') }}" class="text-blue">📋 Layanan</a>
                <span class="text-gray">›</span>
                <span class="text-gray">Edit {{ $serviceRequest->ticket_number }}</span>
            </div>
        </nav>

        <div class="text-center mb-8">
            <h1 class="heading-1 text-red">✏️ Edit Permohonan Layanan</h1>
            <p class="text-lg text-gray">Nomor Tiket: <strong>{{ $serviceRequest->ticket_number }}</strong></p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📝 Update Status & Detail</h2>
                </div>

                <div class="card-body">
                    <form method="POST" action="{{ route('admin.service-requests.update', $serviceRequest) }}">
                        @csrf
                        @method('PATCH')

                        <div class="grid grid-cols-2 mb-6">
                            <!-- Current Status -->
                            <div class="card mr-4">
                                <div class="card-header">
                                    <h3 class="heading-3">📋 Data Saat Ini</h3>
                                </div>
                                <div class="card-body">
                                    <p class="mb-2"><strong>Pemohon:</strong> {{ $serviceRequest->requester_name }}</p>
                                    <p class="mb-2"><strong>Layanan:</strong> {{ $serviceRequest->service_type }}</p>
                                    <p class="mb-2"><strong>Prioritas:</strong> {{ $serviceRequest->priority }}</p>
                                    <p class="mb-2"><strong>Status:</strong> {{ $serviceRequest->status }}</p>
                                    <p class="mb-2"><strong>Dibuat:</strong> {{ $serviceRequest->created_at->format('d M Y H:i') }}</p>
                                </div>
                            </div>

                            <!-- Update Form -->
                            <div>
                                <!-- Status -->
                                <div class="form-group">
                                    <label class="form-label">Status <span style="color: red;">*</span></label>
                                    <select name="status" class="form-select" required>
                                        <option value="pending" {{ $serviceRequest->status === 'pending' ? 'selected' : '' }}>
                                            🕐 Menunggu
                                        </option>
                                        <option value="in_progress" {{ $serviceRequest->status === 'in_progress' ? 'selected' : '' }}>
                                            🔄 Dalam Proses
                                        </option>
                                        <option value="completed" {{ $serviceRequest->status === 'completed' ? 'selected' : '' }}>
                                            ✅ Selesai
                                        </option>
                                        <option value="cancelled" {{ $serviceRequest->status === 'cancelled' ? 'selected' : '' }}>
                                            ❌ Dibatalkan
                                        </option>
                                    </select>
                                    @error('status')
                                        <div class="text-red text-sm mt-1">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Priority -->
                                <div class="form-group">
                                    <label class="form-label">Prioritas</label>
                                    <select name="priority" class="form-select">
                                        <option value="low" {{ $serviceRequest->priority === 'low' ? 'selected' : '' }}>
                                            🟢 Rendah
                                        </option>
                                        <option value="medium" {{ $serviceRequest->priority === 'medium' ? 'selected' : '' }}>
                                            🟡 Sedang
                                        </option>
                                        <option value="high" {{ $serviceRequest->priority === 'high' ? 'selected' : '' }}>
                                            🟠 Tinggi
                                        </option>
                                        <option value="emergency" {{ $serviceRequest->priority === 'emergency' ? 'selected' : '' }}>
                                            🔴 Darurat
                                        </option>
                                    </select>
                                    @error('priority')
                                        <div class="text-red text-sm mt-1">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Assigned To -->
                                <div class="form-group">
                                    <label class="form-label">Ditugaskan ke</label>
                                    <select name="assigned_to" class="form-select">
                                        <option value="">Belum ditugaskan</option>
                                        @foreach(\App\Models\User::all() as $user)
                                            <option value="{{ $user->id }}" 
                                                {{ $serviceRequest->assigned_to == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('assigned_to')
                                        <div class="text-red text-sm mt-1">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <!-- Scheduled Date -->
                        <div class="form-group">
                            <label class="form-label">Tanggal Terjadwal (Opsional)</label>
                            <input 
                                type="datetime-local" 
                                name="scheduled_date" 
                                value="{{ $serviceRequest->scheduled_date?->format('Y-m-d\TH:i') }}" 
                                class="form-input"
                            >
                            @error('scheduled_date')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Notes (Admin Only) -->
                        <div class="form-group">
                            <label class="form-label">Catatan Admin</label>
                            <textarea 
                                name="notes" 
                                class="form-input form-textarea" 
                                placeholder="Catatan internal atau untuk pemohon..."
                                rows="4"
                            >{{ old('notes', $serviceRequest->notes) }}</textarea>
                            @error('notes')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-between items-center mt-8" style="flex-wrap: wrap; gap: 1rem;">
                            <div class="flex gap-4" style="flex-wrap: wrap;">
                                <button type="submit" class="btn btn-primary">
                                    💾 Simpan Perubahan
                                </button>
                                <a href="{{ route('admin.service-requests.index') }}" class="btn btn-outline">
                                    ❌ Batal
                                </a>
                            </div>
                            
                            <form method="POST" action="{{ route('admin.service-requests.destroy', $serviceRequest) }}" 
                                  style="display: inline;" 
                                  onsubmit="return confirm('Apakah Anda yakin ingin menghapus permohonan ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn" style="background: #ef4444; color: white;">
                                    🗑️ Hapus
                                </button>
                            </form>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Original Request Details -->
            <div class="card mt-6">
                <div class="card-header">
                    <h2 class="heading-2">📋 Detail Permohonan Asli</h2>
                </div>
                <div class="card-body">
                    <div class="grid grid-cols-2">
                        <div>
                            <h3 class="heading-3">Data Kontak</h3>
                            <p class="mb-2">📞 {{ $serviceRequest->phone }}</p>
                            @if($serviceRequest->email)
                                <p class="mb-4">📧 {{ $serviceRequest->email }}</p>
                            @endif
                            
                            <h3 class="heading-3">Alamat</h3>
                            <p class="mb-4">📍 {{ $serviceRequest->address }}</p>
                        </div>

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
                        </div>
                    </div>

                    <div class="mt-4">
                        <h3 class="heading-3">Deskripsi</h3>
                        <div class="bg-gray p-4" style="border-radius: 0.5rem;">
                            <p style="margin: 0; white-space: pre-wrap;">{{ $serviceRequest->description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection