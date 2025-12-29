<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\Workstation;
use App\Models\WorkstationOffer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkstationOfferController extends Controller
{
    public function index()
    {
        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo. Crea o selecciona uno.');
        }

        $offers = WorkstationOffer::where('establishment_id', $establishment->id)
            ->with(['workstation', 'applications'])
            ->latest()
            ->get();

        return Inertia::render('business/offers/index', [
            'offers' => $offers,
            'establishment' => $establishment,
        ]);
    }

    public function create()
    {
        $establishment = auth()->user()->activeEstablishment;
        
        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo');
        }

        $availableWorkstations = $establishment->workstations()
            ->where('status', 'available')
            ->whereDoesntHave('offers', function($query) {
                $query->where('status', 'active');
            })
            ->get();

        return Inertia::render('business/offers/create', [
            'workstations' => $availableWorkstations,
            'establishment' => $establishment,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'workstation_id' => 'required|exists:workstations,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'employment_type' => 'required|in:employee,freelancer',
            'commission_model' => 'required|in:percentage,salary_plus,booth_rental,fixed_per_service,salary_only',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'base_salary' => 'nullable|numeric|min:0',
            'booth_rental_fee' => 'nullable|numeric|min:0',
            'schedule' => 'nullable|array',
            'deadline' => 'nullable|date|after:today',
        ]);

        $establishment = Establishment::where('owner_id', auth()->id())->first();

        $offer = WorkstationOffer::create([
            'establishment_id' => $establishment->id,
            ...$validated,
            'status' => 'active',
        ]);

        return redirect()->route('business.offers.index')
            ->with('success', 'Oferta publicada exitosamente');
    }

    public function update(Request $request, WorkstationOffer $offer)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,closed,filled',
        ]);

        $offer->update($validated);

        return redirect()->route('business.offers.index')
            ->with('success', 'Oferta actualizada');
    }

    public function destroy(WorkstationOffer $offer)
    {
        $offer->delete();

        return redirect()->route('business.offers.index')
            ->with('success', 'Oferta eliminada');
    }
}
