@extends('layouts.app')

@section('content')
<section class="py-12">
    <div class="container">
        <div style="max-width: 400px; margin: 0 auto;">
            <div class="text-center mb-8">
                <h1 class="heading-1 text-red">🔐 Login Admin</h1>
                <p class="text-gray">Masuk ke dashboard administrator</p>
            </div>

            @if(session('status'))
                <div class="card mb-6 bg-blue">
                    <div class="card-body text-center">
                        <p style="margin: 0;">{{ session('status') }}</p>
                    </div>
                </div>
            @endif

            <div class="card">
                <div class="card-header">
                    <h2 class="heading-2">Masuk ke Sistem</h2>
                </div>
                
                <div class="card-body">
                    <form method="POST" action="{{ route('login') }}">
                        @csrf

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
                                autofocus
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
                                placeholder="Masukkan password"
                                required
                            >
                            @error('password')
                                <div class="text-red text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Remember Me -->
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
                                <span class="text-sm">Ingat saya</span>
                            </label>
                        </div>

                        <!-- Actions -->
                        <div class="text-center mt-8">
                            <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;">
                                🔐 Masuk
                            </button>
                        </div>

                        @if($canResetPassword)
                            <div class="text-center mt-4">
                                <a href="{{ route('password.request') }}" class="text-blue text-sm">
                                    Lupa password?
                                </a>
                            </div>
                        @endif
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