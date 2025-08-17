@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <div class="text-center mb-8">
            <h1 class="heading-1 text-red">📋 Ajukan Layanan</h1>
            <p class="text-lg text-gray">Formulir permohonan layanan pemadam kebakaran</p>
        </div>

        <div style="max-width: 600px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">🔥 Form Permohonan Layanan</h2>
                    <p class="text-gray">Lengkapi data berikut untuk mengajukan layanan</p>
                </div>

                <div class="card-body">
                    <form method="POST" action="{{ route('service-requests.store') }}">
                        @csrf

                        <!-- Service Type -->
                        <div class="form-group">
                            <label class="form-label">Jenis Layanan <span style="color: red;">*</span></label>
                            <select name="service_type" class="form-select" required>
                                <option value="">Pilih jenis layanan...</option>
                                <option value="fire_emergency" {{ old('service_type') === 'fire_emergency' ? 'selected' : '' }}>
                                    🚨 Darurat Kebakaran
                                </option>
                                <option value="fire_prevention" {{ old('service_type') === 'fire_prevention' ? 'selected' : '' }}>
                                    🛡️ Pencegahan Kebakaran
                                </option>
                                <option value="safety_inspection" {{ old('service_type') === 'safety_inspection' ? 'selected' : '' }}>
                                    🔍 Inspeksi Keselamatan
                                </option>
                                <option value="training" {{ old('service_type') === 'training' ? 'selected' : '' }}>
                                    📚 Pelatihan K3
                                </option>
                                <option value="consultation" {{ old('service_type') === 'consultation' ? 'selected' : '' }}>
                                    💬 Konsultasi
                                </option>
                                <option value="other" {{ old('service_type') === 'other' ? 'selected' : '' }}>
                                    📝 Lainnya
                                </option>
                            </select>
                            @error('service_type')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Requester Name -->
                        <div class="form-group">
                            <label class="form-label">Nama Pemohon <span style="color: red;">*</span></label>
                            <input 
                                type="text" 
                                name="requester_name" 
                                value="{{ old('requester_name') }}" 
                                class="form-input" 
                                placeholder="Masukkan nama lengkap"
                                required
                            >
                            @error('requester_name')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Phone -->
                        <div class="form-group">
                            <label class="form-label">Nomor Telepon <span style="color: red;">*</span></label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value="{{ old('phone') }}" 
                                class="form-input" 
                                placeholder="08xxxxxxxxxx"
                                required
                            >
                            @error('phone')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Email -->
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value="{{ old('email') }}" 
                                class="form-input" 
                                placeholder="email@example.com"
                            >
                            @error('email')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Address -->
                        <div class="form-group">
                            <label class="form-label">Alamat <span style="color: red;">*</span></label>
                            <textarea 
                                name="address" 
                                class="form-input form-textarea" 
                                placeholder="Masukkan alamat lengkap"
                                required
                            >{{ old('address') }}</textarea>
                            @error('address')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Priority -->
                        <div class="form-group">
                            <label class="form-label">Tingkat Prioritas <span style="color: red;">*</span></label>
                            <select name="priority" class="form-select" required>
                                <option value="">Pilih prioritas...</option>
                                <option value="low" {{ old('priority') === 'low' ? 'selected' : '' }}>
                                    🟢 Rendah - Tidak Mendesak
                                </option>
                                <option value="medium" {{ old('priority') === 'medium' ? 'selected' : '' }}>
                                    🟡 Sedang - Perlu Segera
                                </option>
                                <option value="high" {{ old('priority') === 'high' ? 'selected' : '' }}>
                                    🟠 Tinggi - Mendesak
                                </option>
                                <option value="emergency" {{ old('priority') === 'emergency' ? 'selected' : '' }}>
                                    🔴 Darurat - Segera
                                </option>
                            </select>
                            @error('priority')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Description -->
                        <div class="form-group">
                            <label class="form-label">Deskripsi Layanan <span style="color: red;">*</span></label>
                            <textarea 
                                name="description" 
                                class="form-input form-textarea" 
                                placeholder="Jelaskan detail layanan yang dibutuhkan..."
                                required
                                rows="5"
                            >{{ old('description') }}</textarea>
                            @error('description')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Notes -->
                        <div class="form-group">
                            <label class="form-label">Catatan Tambahan</label>
                            <textarea 
                                name="notes" 
                                class="form-input form-textarea" 
                                placeholder="Informasi tambahan (opsional)"
                                rows="3"
                            >{{ old('notes') }}</textarea>
                            @error('notes')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Submit Button -->
                        <div class="text-center mt-8">
                            <button type="submit" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                                📤 Kirim Permohonan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Emergency Notice -->
            <div class="card mt-6 bg-red">
                <div class="card-body text-center">
                    <h3 class="heading-3" style="color: #dc2626;">🚨 KONDISI DARURAT?</h3>
                    <p class="mb-4">Jika ini adalah keadaan darurat kebakaran, segera hubungi:</p>
                    <a href="tel:113" class="btn btn-primary" style="font-size: 1.2rem;">📞 PANGGIL 113</a>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection