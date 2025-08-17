@extends('layouts.app')

@section('content')
<section class="py-12">
    <div class="container">
        <div style="max-width: 500px; margin: 0 auto;">
            <div class="text-center mb-8">
                <h1 class="heading-1 text-red">📝 Registrasi Admin</h1>
                <p class="text-gray">Buat akun administrator baru</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">Daftar Akun Baru</h2>
                </div>
                
                <div class="card-body">
                    <form method="POST" action="{{ route('register') }}">
                        @csrf

                        <!-- Name -->
                        <div class="form-group">
                            <label class="form-label">Nama Lengkap</label>
                            <input 
                                type="text" 
                                name="name" 
                                value="{{ old('name') }}" 
                                class="form-input" 
                                placeholder="Nama administrator"
                                required 
                                autofocus
                            >
                            @error('name')
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
                                placeholder="admin@damkar.go.id"
                                required
                            >
                            @error('email')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Password -->
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                class="form-input" 
                                placeholder="Password minimal 8 karakter"
                                required
                            >
                            @error('password')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Confirm Password -->
                        <div class="form-group">
                            <label class="form-label">Konfirmasi Password</label>
                            <input 
                                type="password" 
                                name="password_confirmation" 
                                class="form-input" 
                                placeholder="Ulangi password"
                                required
                            >
                            @error('password_confirmation')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Actions -->
                        <div class="text-center mt-8">
                            <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;">
                                📝 Daftar
                            </button>
                        </div>

                        <div class="text-center mt-4">
                            <span class="text-sm text-gray">Sudah punya akun? </span>
                            <a href="{{ route('login') }}" class="text-blue text-sm">
                                Masuk di sini
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Back to Home -->
            <div class="text-center mt-6">
                <a href="{{ route('home') }}" class="btn btn-outline">
                    🏠 Kembali ke Beranda
                </a>
            </div>
        </div>
    </div>
</section>
@endsection