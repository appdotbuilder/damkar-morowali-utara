<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PpidController;
use App\Http\Controllers\ServiceRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Fire Department main website
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public routes
Route::get('/berita', [NewsController::class, 'index'])->name('news.index');
Route::get('/berita/{article}', [NewsController::class, 'show'])->name('news.show');

// Service Requests (public)
Route::get('/layanan', [ServiceRequestController::class, 'create'])->name('service-requests.create');
Route::post('/layanan', [ServiceRequestController::class, 'store'])->name('service-requests.store');
Route::get('/layanan/{serviceRequest}', [ServiceRequestController::class, 'show'])->name('service-requests.show');

// PPID (public information requests)
Route::get('/ppid', [PpidController::class, 'index'])->name('ppid.index');
Route::get('/ppid/permohonan', [PpidController::class, 'create'])->name('ppid.create');
Route::post('/ppid/permohonan', [PpidController::class, 'store'])->name('ppid.store');
Route::get('/ppid/permohonan/{ppidRequest}', [PpidController::class, 'show'])->name('ppid.show');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    
    // Admin routes for service requests
    Route::get('/admin/layanan', [ServiceRequestController::class, 'index'])->name('admin.service-requests.index');
    Route::get('/admin/layanan/{serviceRequest}/edit', [ServiceRequestController::class, 'edit'])->name('admin.service-requests.edit');
    Route::patch('/admin/layanan/{serviceRequest}', [ServiceRequestController::class, 'update'])->name('admin.service-requests.update');
    Route::delete('/admin/layanan/{serviceRequest}', [ServiceRequestController::class, 'destroy'])->name('admin.service-requests.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
