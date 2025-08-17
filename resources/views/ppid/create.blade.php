@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="mb-8">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('home') }}" class="text-blue">🏠 Beranda</a>
                <span class="text-gray">›</span>
                <a href="{{ route('ppid.index') }}" class="text-blue">📄 PPID</a>
                <span class="text-gray">›</span>
                <span class="text-gray">Permohonan Baru</span>
            </div>
        </nav>

        <div class="text-center mb-8">
            <h1 class="heading-1 text-blue">📝 Formulir Permohonan Informasi</h1>
            <p class="text-lg text-gray">Ajukan permohonan informasi publik sesuai UU No. 14 Tahun 2008</p>
        </div>

        <div style="max-width: 700px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">📋 Data Pemohon</h2>
                    <p class="text-gray">Lengkapi data diri untuk mengajukan permohonan informasi</p>
                </div>

                <div class="card-body">
                    <form method="POST" action="{{ route('ppid.store') }}">
                        @csrf

                        <!-- Requester Name -->
                        <div class="form-group">
                            <label class="form-label">Nama Lengkap <span style="color: red;">*</span></label>
                            <input 
                                type="text" 
                                name="requester_name" 
                                value="{{ old('requester_name') }}" 
                                class="form-input" 
                                placeholder="Nama sesuai identitas"
                                required
                            >
                            @error('requester_name')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Identity Type & Number -->
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label class="form-label">Jenis Identitas <span style="color: red;">*</span></label>
                                <select name="identity_type" class="form-select" required>
                                    <option value="">Pilih jenis identitas...</option>
                                    <option value="ktp" {{ old('identity_type') === 'ktp' ? 'selected' : '' }}>
                                        🆔 KTP
                                    </option>
                                    <option value="passport" {{ old('identity_type') === 'passport' ? 'selected' : '' }}>
                                        📘 Paspor
                                    </option>
                                    <option value="kitas" {{ old('identity_type') === 'kitas' ? 'selected' : '' }}>
                                        📄 KITAS
                                    </option>
                                </select>
                                @error('identity_type')
                                    <div class="text-red text-sm mt-1">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label class="form-label">Nomor Identitas <span style="color: red;">*</span></label>
                                <input 
                                    type="text" 
                                    name="identity_number" 
                                    value="{{ old('identity_number') }}" 
                                    class="form-input" 
                                    placeholder="Nomor sesuai identitas"
                                    required
                                >
                                @error('identity_number')
                                    <div class="text-red text-sm mt-1">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Address -->
                        <div class="form-group">
                            <label class="form-label">Alamat <span style="color: red;">*</span></label>
                            <textarea 
                                name="address" 
                                class="form-input form-textarea" 
                                placeholder="Alamat lengkap sesuai identitas"
                                required
                                rows="3"
                            >{{ old('address') }}</textarea>
                            @error('address')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Contact -->
                        <div class="grid grid-cols-2">
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
                        </div>

                        <!-- Job -->
                        <div class="form-group">
                            <label class="form-label">Pekerjaan <span style="color: red;">*</span></label>
                            <input 
                                type="text" 
                                name="job" 
                                value="{{ old('job') }}" 
                                class="form-input" 
                                placeholder="Pekerjaan/profesi saat ini"
                                required
                            >
                            @error('job')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>
                    </form>
                </div>
            </div>

            <!-- Request Information -->
            <div class="card mt-6">
                <div class="card-header">
                    <h2 class="heading-2">📄 Detail Informasi yang Diminta</h2>
                </div>

                <div class="card-body">
                    <form method="POST" action="{{ route('ppid.store') }}" id="ppidForm">
                        @csrf
                        
                        <!-- Copy all previous form fields as hidden -->
                        <input type="hidden" name="requester_name" id="hidden_requester_name">
                        <input type="hidden" name="identity_type" id="hidden_identity_type">
                        <input type="hidden" name="identity_number" id="hidden_identity_number">
                        <input type="hidden" name="address" id="hidden_address">
                        <input type="hidden" name="phone" id="hidden_phone">
                        <input type="hidden" name="email" id="hidden_email">
                        <input type="hidden" name="job" id="hidden_job">

                        <!-- Information Type -->
                        <div class="form-group">
                            <label class="form-label">Jenis Informasi <span style="color: red;">*</span></label>
                            <select name="information_type" class="form-select" required>
                                <option value="">Pilih jenis informasi...</option>
                                <option value="regular" {{ old('information_type') === 'regular' ? 'selected' : '' }}>
                                    📄 Informasi Berkala
                                </option>
                                <option value="immediate" {{ old('information_type') === 'immediate' ? 'selected' : '' }}>
                                    ⚡ Informasi Serta Merta
                                </option>
                                <option value="on_demand" {{ old('information_type') === 'on_demand' ? 'selected' : '' }}>
                                    📋 Informasi Setiap Saat
                                </option>
                            </select>
                            @error('information_type')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Information Details -->
                        <div class="form-group">
                            <label class="form-label">Rincian Informasi <span style="color: red;">*</span></label>
                            <textarea 
                                name="information_details" 
                                class="form-input form-textarea" 
                                placeholder="Jelaskan secara detail informasi yang Anda butuhkan..."
                                required
                                rows="5"
                            >{{ old('information_details') }}</textarea>
                            @error('information_details')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Purpose -->
                        <div class="form-group">
                            <label class="form-label">Tujuan Penggunaan <span style="color: red;">*</span></label>
                            <textarea 
                                name="purpose" 
                                class="form-input form-textarea" 
                                placeholder="Jelaskan tujuan penggunaan informasi yang diminta..."
                                required
                                rows="3"
                            >{{ old('purpose') }}</textarea>
                            @error('purpose')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Delivery Method -->
                        <div class="form-group">
                            <label class="form-label">Cara Penyampaian <span style="color: red;">*</span></label>
                            <select name="delivery_method" class="form-select" required>
                                <option value="">Pilih cara penyampaian...</option>
                                <option value="email" {{ old('delivery_method') === 'email' ? 'selected' : '' }}>
                                    📧 Email
                                </option>
                                <option value="hardcopy" {{ old('delivery_method') === 'hardcopy' ? 'selected' : '' }}>
                                    📄 Hardcopy (Diambil di kantor)
                                </option>
                                <option value="postal" {{ old('delivery_method') === 'postal' ? 'selected' : '' }}>
                                    📮 Pos/Kurir
                                </option>
                                <option value="digital" {{ old('delivery_method') === 'digital' ? 'selected' : '' }}>
                                    💾 Media Digital (CD/USB)
                                </option>
                            </select>
                            @error('delivery_method')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Submit Button -->
                        <div class="text-center mt-8">
                            <button type="button" onclick="submitForm()" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                                📤 Kirim Permohonan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Information Notice -->
            <div class="card mt-6 bg-blue">
                <div class="card-body">
                    <h3 class="heading-3">ℹ️ Ketentuan Permohonan</h3>
                    <ul style="list-style: none; padding-left: 1rem;">
                        <li class="mb-2">✅ Permohonan akan diproses maksimal 10 hari kerja</li>
                        <li class="mb-2">✅ Informasi yang tidak dikecualikan akan diberikan</li>
                        <li class="mb-2">✅ Biaya reproduksi sesuai ketentuan yang berlaku</li>
                        <li class="mb-2">✅ Pemohon akan diberikan nomor register sebagai tanda bukti</li>
                        <li>✅ Status permohonan dapat dipantau dengan nomor register</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
function submitForm() {
    // Copy values from first form to hidden inputs
    document.getElementById('hidden_requester_name').value = document.querySelector('input[name="requester_name"]').value;
    document.getElementById('hidden_identity_type').value = document.querySelector('select[name="identity_type"]').value;
    document.getElementById('hidden_identity_number').value = document.querySelector('input[name="identity_number"]').value;
    document.getElementById('hidden_address').value = document.querySelector('textarea[name="address"]').value;
    document.getElementById('hidden_phone').value = document.querySelector('input[name="phone"]').value;
    document.getElementById('hidden_email').value = document.querySelector('input[name="email"]').value;
    document.getElementById('hidden_job').value = document.querySelector('input[name="job"]').value;
    
    // Submit the form
    document.getElementById('ppidForm').submit();
}
</script>
@endsection