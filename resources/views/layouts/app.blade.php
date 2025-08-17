<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ isset($title) ? $title . ' - ' : '' }}{{ config('app.name', 'Dinas Pemadam Kebakaran') }}</title>
    
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
    
    <style>
        :root {
            --color-primary-red: #dc2626;
            --color-primary-blue: #2563eb;
            --color-light-red: #fef2f2;
            --color-light-blue: #eff6ff;
            --color-dark-red: #991b1b;
            --color-dark-blue: #1d4ed8;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #374151;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, var(--color-primary-red) 0%, var(--color-primary-blue) 100%);
            color: white;
            padding: 1rem 0;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 600;
            text-decoration: none;
            color: white;
        }
        
        .logo-icon {
            width: 2rem;
            height: 2rem;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .nav {
            display: flex;
            gap: 2rem;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        
        .nav-link:hover {
            opacity: 0.8;
        }
        
        /* Button Styles */
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        
        .btn-primary {
            background: var(--color-primary-red);
            color: white;
        }
        
        .btn-primary:hover {
            background: var(--color-dark-red);
        }
        
        .btn-secondary {
            background: var(--color-primary-blue);
            color: white;
        }
        
        .btn-secondary:hover {
            background: var(--color-dark-blue);
        }
        
        .btn-outline {
            background: transparent;
            color: var(--color-primary-red);
            border: 2px solid var(--color-primary-red);
        }
        
        .btn-outline:hover {
            background: var(--color-primary-red);
            color: white;
        }
        
        .btn-white {
            background: white;
            color: var(--color-primary-red);
        }
        
        .btn-white:hover {
            background: #f8fafc;
        }
        
        /* Card Styles */
        .card {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .card-body {
            padding: 1.5rem;
        }
        
        .card-footer {
            padding: 1rem 1.5rem;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }
        
        /* Grid System */
        .grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .grid-cols-1 { grid-template-columns: 1fr; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        
        @media (max-width: 768px) {
            .grid-cols-2, .grid-cols-3, .grid-cols-4 {
                grid-template-columns: 1fr;
            }
        }
        
        /* Typography */
        .heading-1 {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
        }
        
        .heading-2 {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 0.75rem;
        }
        
        .heading-3 {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 0.5rem;
        }
        
        .text-red { color: var(--color-primary-red); }
        .text-blue { color: var(--color-primary-blue); }
        .text-gray { color: #6b7280; }
        .text-center { text-align: center; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        
        /* Utilities */
        .mt-1 { margin-top: 0.25rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        
        .bg-red { background: var(--color-light-red); }
        .bg-blue { background: var(--color-light-blue); }
        .bg-gray { background: #f9fafb; }
        
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-4 { gap: 1rem; }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--color-primary-red) 0%, var(--color-primary-blue) 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            .hero p {
                font-size: 1rem;
            }
            .header-content {
                flex-direction: column;
                text-align: center;
            }
            .nav {
                justify-content: center;
            }
        }
        
        /* Form Styles */
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #374151;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--color-primary-blue);
        }
        
        .form-textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 1rem;
            background: white;
        }
        
        /* Footer */
        .footer {
            background: #1f2937;
            color: white;
            padding: 2rem 0;
            text-align: center;
            margin-top: 4rem;
        }
        
        .footer p {
            opacity: 0.8;
        }
    </style>
    
    @stack('styles')
</head>
<body class="h-full">
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="{{ route('home') }}" class="logo">
                    <div class="logo-icon">🚒</div>
                    <span>Dinas Pemadam Kebakaran</span>
                </a>
                
                <nav class="nav">
                    <a href="{{ route('home') }}" class="nav-link">Beranda</a>
                    <a href="{{ route('news.index') }}" class="nav-link">Berita</a>
                    <a href="{{ route('service-requests.create') }}" class="nav-link">Layanan</a>
                    <a href="{{ route('ppid.index') }}" class="nav-link">PPID</a>
                    
                    @auth
                        <a href="{{ route('dashboard') }}" class="nav-link">Dashboard</a>
                        <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                            @csrf
                            <button type="submit" class="nav-link" style="background: none; border: none; cursor: pointer;">Logout</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-white">Login</a>
                    @endauth
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; {{ date('Y') }} Dinas Pemadam Kebakaran. Melayani dengan Dedikasi dan Profesionalisme.</p>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>