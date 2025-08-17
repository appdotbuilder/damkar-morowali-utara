@extends('layouts.app')

@section('content')
<section class="py-8">
    <div class="container">
        <div class="text-center mb-8">
            <h1 class="heading-1 text-blue">📄 PPID - Pejabat Pengelola Informasi dan Dokumentasi</h1>
            <p class="text-lg text-gray">Layanan informasi publik Dinas Pemadam Kebakaran</p>
        </div>

        <!-- What is PPID -->
        <div class="card mb-8">
            <div class="card-header">
                <h2 class="heading-2">ℹ️ Apa itu PPID?</h2>
            </div>
            <div class="card-body">
                <p class="mb-4 text-lg">
                    PPID (Pejabat Pengelola Informasi dan Dokumentasi) adalah layanan yang mengelola 
                    dan menyediakan informasi publik sesuai dengan Undang-Undang No. 14 Tahun 2008 
                    tentang Keterbukaan Informasi Publik.
                </p>
                <p class="text-gray">
                    Melalui layanan ini, masyarakat dapat mengajukan permohonan informasi terkait 
                    kegiatan, program, dan data publik yang dikelola oleh Dinas Pemadam Kebakaran.
                </p>
            </div>
        </div>

        <!-- Services -->
        <div class="grid grid-cols-2 mb-8">
            <div class="card">
                <div class="card-header bg-red">
                    <h3 class="heading-3" style="color: white;">📋 Jenis Informasi Tersedia</h3>
                </div>
                <div class="card-body">
                    <ul style="list-style: none; padding: 0;">
                        <li class="mb-3">🔥 Data statistik kebakaran</li>
                        <li class="mb-3">🚒 Profil dan struktur organisasi</li>
                        <li class="mb-3">💰 Laporan keuangan</li>
                        <li class="mb-3">📊 Program kerja dan kegiatan</li>
                        <li class="mb-3">🏢 Data pos pemadam kebakaran</li>
                        <li class="mb-3">📚 Peraturan dan kebijakan</li>
                        <li class="mb-3">🎯 Rencana strategis dinas</li>
                        <li class="mb-3">👥 Data SDM dan personel</li>
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header bg-blue">
                    <h3 class="heading-3" style="color: white;">⚡ Prosedur Permohonan</h3>
                </div>
                <div class="card-body">
                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span style="background: var(--color-primary-red); color: white; width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: 0.75rem;">1</span>
                            <span>Isi formulir permohonan</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span style="background: var(--color-primary-red); color: white; width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: 0.75rem;">2</span>
                            <span>Verifikasi dan validasi</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span style="background: var(--color-primary-red); color: white; width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: 0.75rem;">3</span>
                            <span>Proses permohonan (max 10 hari)</span>
                        </div>
                        <div class="flex items-center">
                            <span style="background: var(--color-primary-red); color: white; width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: 0.75rem;">4</span>
                            <span>Penyerahan informasi</span>
                        </div>
                    </div>
                    <p class="text-sm text-gray">
                        Permohonan akan diproses sesuai ketentuan UU No. 14 Tahun 2008
                    </p>
                </div>
            </div>
        </div>

        <!-- Request Form CTA -->
        <div class="card bg-blue text-center mb-8">
            <div class="card-body">
                <h2 class="heading-2">📝 Ajukan Permohonan Informasi</h2>
                <p class="text-lg mb-6">Butuh informasi publik? Ajukan permohonan Anda sekarang</p>
                <a href="{{ route('ppid.create') }}" class="btn btn-white" style="font-size: 1.1rem; padding: 1rem 2rem;">
                    📋 Buat Permohonan Baru
                </a>
            </div>
        </div>

        <!-- Information Categories -->
        <div class="grid grid-cols-3 mb-8">
            <div class="card">
                <div class="card-body text-center">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🟢</div>
                    <h3 class="heading-3 text-blue">Informasi Berkala</h3>
                    <p class="text-gray">
                        Informasi yang wajib disediakan secara berkala seperti laporan tahunan, 
                        statistik, dan profil organisasi
                    </p>
                </div>
            </div>

            <div class="card">
                <div class="card-body text-center">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🟡</div>
                    <h3 class="heading-3 text-blue">Informasi Serta Merta</h3>
                    <p class="text-gray">
                        Informasi yang dapat mengancam hajat hidup orang banyak dan 
                        ketertiban umum seperti peringatan bahaya
                    </p>
                </div>
            </div>

            <div class="card">
                <div class="card-body text-center">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔵</div>
                    <h3 class="heading-3 text-blue">Informasi Setiap Saat</h3>
                    <p class="text-gray">
                        Informasi yang harus disediakan atas permohanan seperti data spesifik, 
                        dokumen kebijakan, dan prosedur
                    </p>
                </div>
            </div>
        </div>

        <!-- Contact Information -->
        <div class="card">
            <div class="card-header">
                <h2 class="heading-2">📞 Kontak PPID</h2>
            </div>
            <div class="card-body">
                <div class="grid grid-cols-2">
                    <div>
                        <h3 class="heading-3">Alamat Kantor</h3>
                        <p class="mb-4">
                            📍 Kantor Dinas Pemadam Kebakaran<br>
                            Jl. Layanan Publik No. 123<br>
                            Jakarta 12345
                        </p>
                        
                        <h3 class="heading-3">Jam Pelayanan</h3>
                        <p class="mb-4">
                            🕐 Senin - Jumat: 08:00 - 16:00 WIB<br>
                            🕐 Sabtu: 08:00 - 12:00 WIB<br>
                            ❌ Minggu & Hari Libur: Tutup
                        </p>
                    </div>
                    
                    <div>
                        <h3 class="heading-3">Kontak</h3>
                        <p class="mb-4">
                            📞 Telepon: (021) 123-4567<br>
                            📧 Email: ppid@damkar.go.id<br>
                            🌐 Website: www.damkar.go.id
                        </p>
                        
                        <h3 class="heading-3">Media Sosial</h3>
                        <div class="flex gap-2" style="flex-wrap: wrap;">
                            <a href="#" class="btn btn-secondary text-sm">📘 Facebook</a>
                            <a href="#" class="btn btn-secondary text-sm">🐦 Twitter</a>
                            <a href="#" class="btn btn-secondary text-sm">📷 Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection