<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePpidRequestRequest;
use App\Models\PpidRequest;
use Inertia\Inertia;

class PpidController extends Controller
{
    /**
     * Display the PPID information page.
     */
    public function index()
    {
        return Inertia::render('ppid/index');
    }

    /**
     * Show the form for creating a new PPID request.
     */
    public function create()
    {
        return Inertia::render('ppid/create');
    }

    /**
     * Store a newly created PPID request.
     */
    public function store(StorePpidRequestRequest $request)
    {
        $ppidRequest = PpidRequest::create([
            ...$request->validated(),
            'request_number' => PpidRequest::generateRequestNumber(),
        ]);

        return redirect()->route('ppid.show', $ppidRequest)
            ->with('success', 'Permohonan informasi berhasil diajukan. Nomor register: ' . $ppidRequest->request_number);
    }

    /**
     * Display the specified PPID request.
     */
    public function show(PpidRequest $ppidRequest)
    {
        $ppidRequest->load(['processedBy']);
        
        return Inertia::render('ppid/show', [
            'ppidRequest' => $ppidRequest
        ]);
    }


}