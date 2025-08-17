<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FireIncident;
use App\Models\FireStation;
use App\Models\NewsArticle;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $latestNews = NewsArticle::published()
            ->latest('published_at')
            ->take(6)
            ->get();

        $recentIncidents = FireIncident::with([])
            ->latest('incident_date')
            ->take(3)
            ->get();

        $fireStations = FireStation::active()
            ->take(5)
            ->get();

        $statistics = [
            'total_incidents' => FireIncident::count(),
            'incidents_this_month' => FireIncident::whereMonth('incident_date', now()->month)
                ->whereYear('incident_date', now()->year)
                ->count(),
            'active_stations' => FireStation::active()->count(),
            'avg_response_time' => FireIncident::whereNotNull('response_time_minutes')
                ->avg('response_time_minutes'),
        ];

        return Inertia::render('welcome', [
            'latestNews' => $latestNews,
            'recentIncidents' => $recentIncidents,
            'fireStations' => $fireStations,
            'statistics' => $statistics,
        ]);
    }
}