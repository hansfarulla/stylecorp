<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $establishment = Establishment::where('owner_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        if (!$establishment) {
            return redirect()->route('business.dashboard');
        }

        $services = Service::where('establishment_id', $establishment->id)
            ->with('professional')
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('business/services/index', [
            'services' => $services,
            'establishment' => $establishment,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();
        
        $professionals = $establishment->users;

        return Inertia::render('business/services/create', [
            'professionals' => $professionals,
            'establishment' => $establishment,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'professional_ids' => 'nullable|array',
            'professional_ids.*' => 'exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:cut,beard,coloring,styling,treatment,waxing,facial,massage,nails,makeup,other',
            'base_price' => 'required|numeric|min:0',
            'duration_minutes' => 'nullable|integer|min:1',
            'available_online' => 'boolean',
            'available_home_service' => 'boolean',
            'home_service_surcharge' => 'nullable|numeric|min:0',
            'home_service_radius_km' => 'nullable|numeric|min:0',
            'home_service_latitude' => 'nullable|numeric|between:-90,90',
            'home_service_longitude' => 'nullable|numeric|between:-180,180',
            'delivery_tiers' => 'nullable|array',
            'delivery_tiers.*.from_km' => 'required|numeric|min:0',
            'delivery_tiers.*.to_km' => 'required|numeric|gt:delivery_tiers.*.from_km',
            'delivery_tiers.*.fee' => 'required|numeric|min:0',
        ]);

        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();

        $validated['tenant_id'] = $user->tenant_id;
        $validated['establishment_id'] = $establishment->id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . uniqid();
        $validated['is_active'] = true;
        $validated['home_service_surcharge'] = $validated['home_service_surcharge'] ?? 0;

        $service = Service::create($validated);

        if (isset($validated['professional_ids'])) {
            $service->professionals()->sync($validated['professional_ids']);
        }

        return redirect()->route('business.services.show', $service)
            ->with('success', 'Servicio creado exitosamente');
    }

    public function show(Service $service)
    {
        $service->load(['professionals', 'establishment']);

        return Inertia::render('business/services/show', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service)
    {
        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();
        
        $professionals = $establishment->users;

        $service->load('professionals');

        return Inertia::render('business/services/edit', [
            'service' => $service,
            'professionals' => $professionals,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'professional_ids' => 'nullable|array',
            'professional_ids.*' => 'exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:cut,beard,coloring,styling,treatment,waxing,facial,massage,nails,makeup,other',
            'base_price' => 'required|numeric|min:0',
            'duration_minutes' => 'nullable|integer|min:1',
            'available_online' => 'boolean',
            'available_home_service' => 'boolean',
            'home_service_surcharge' => 'nullable|numeric|min:0',
            'home_service_radius_km' => 'nullable|numeric|min:0',
            'home_service_latitude' => 'nullable|numeric|between:-90,90',
            'home_service_longitude' => 'nullable|numeric|between:-180,180',
            'delivery_tiers' => 'nullable|array',
            'delivery_tiers.*.from_km' => 'required|numeric|min:0',
            'delivery_tiers.*.to_km' => 'required|numeric',
            'delivery_tiers.*.fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['home_service_surcharge'] = $validated['home_service_surcharge'] ?? 0;

        $service->update($validated);

        if (isset($validated['professional_ids'])) {
            $service->professionals()->sync($validated['professional_ids']);
        } else {
            $service->professionals()->detach();
        }

        return redirect()->route('business.services.show', $service)
            ->with('success', 'Servicio actualizado exitosamente');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('business.services.index')
            ->with('success', 'Servicio eliminado exitosamente');
    }
}
