<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequestRequest;
use App\Models\ServiceRequest;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $serviceRequests = ServiceRequest::with(['assignedTo'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('service-requests/index', [
            'serviceRequests' => $serviceRequests
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('service-requests/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequestRequest $request)
    {
        $serviceRequest = ServiceRequest::create([
            ...$request->validated(),
            'ticket_number' => ServiceRequest::generateTicketNumber(),
        ]);

        return redirect()->route('service-requests.show', $serviceRequest)
            ->with('success', 'Permohonan layanan berhasil diajukan. Nomor tiket: ' . $serviceRequest->ticket_number);
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceRequest $serviceRequest)
    {
        $serviceRequest->load(['assignedTo']);
        
        return Inertia::render('service-requests/show', [
            'serviceRequest' => $serviceRequest
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceRequest $serviceRequest)
    {
        return Inertia::render('service-requests/edit', [
            'serviceRequest' => $serviceRequest
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreServiceRequestRequest $request, ServiceRequest $serviceRequest)
    {
        $serviceRequest->update($request->validated());

        return redirect()->route('service-requests.show', $serviceRequest)
            ->with('success', 'Permohonan layanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceRequest $serviceRequest)
    {
        $serviceRequest->delete();

        return redirect()->route('service-requests.index')
            ->with('success', 'Permohonan layanan berhasil dihapus.');
    }
}