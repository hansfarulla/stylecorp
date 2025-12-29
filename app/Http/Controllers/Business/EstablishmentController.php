<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EstablishmentController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return redirect()->route('business.establishment.create')
                ->with('info', 'Primero debes crear un establecimiento');
        }

        // Cargar relaciones necesarias
        $establishment->load(['owner', 'manager', 'users']);

        return Inertia::render('business/establishment/index', [
            'establishment' => $establishment,
        ]);
    }

    public function create()
    {
        // Obtener usuarios con rol manager del tenant actual
        $managers = User::where('tenant_id', auth()->user()->tenant_id)
            ->where('role', 'manager')
            ->where('status', 'active')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('business/establishment/create', [
            'managers' => $managers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'address' => 'required|string|max:500',
            'province' => 'required|string|max:100',
            'canton' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'business_hours' => 'nullable|array',
            'accepts_walk_ins' => 'boolean',
            'offers_home_service' => 'boolean',
            'min_booking_hours' => 'nullable|integer|min:0',
            'cancellation_hours' => 'nullable|integer|min:0',
            'number_of_workstations' => 'nullable|integer|min:1|max:50',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        // Convert business_hours array to JSON
        if (isset($validated['business_hours'])) {
            $validated['business_hours'] = json_encode($validated['business_hours']);
        }

        $validated['owner_id'] = auth()->id();
        $validated['tenant_id'] = auth()->user()->tenant_id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . uniqid();
        $validated['status'] = 'active';
        $validated['payment_flow'] = 'mixed';

        // Extraer number_of_workstations antes de crear
        $numberOfWorkstations = $validated['number_of_workstations'] ?? 0;
        unset($validated['number_of_workstations']);

        $establishment = Establishment::create($validated);

        // Establecer como establecimiento activo automáticamente
        auth()->user()->update(['active_establishment_id' => $establishment->id]);

        // Crear estaciones de trabajo automáticamente
        if ($numberOfWorkstations > 0) {
            for ($i = 1; $i <= $numberOfWorkstations; $i++) {
                $establishment->workstations()->create([
                    'name' => "Estación $i",
                    'number' => (string) $i,
                    'status' => 'available',
                ]);
            }
        }

        return redirect()->route('business.workstations.index')
            ->with('success', "Establecimiento creado exitosamente" . ($numberOfWorkstations > 0 ? " con $numberOfWorkstations estaciones de trabajo" : ''));
    }

    public function show(Establishment $establishment)
    {
        $establishment->load(['users', 'services', 'reviews']);

        return Inertia::render('business/establishment/show', [
            'establishment' => $establishment,
        ]);
    }

    public function edit(Establishment $establishment)
    {
        // Obtener usuarios con rol manager del tenant actual
        $managers = User::where('tenant_id', auth()->user()->tenant_id)
            ->where('role', 'manager')
            ->where('status', 'active')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('business/establishment/edit', [
            'establishment' => $establishment,
            'managers' => $managers,
        ]);
    }

    public function update(Request $request, Establishment $establishment)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:50',
            'type' => 'required|in:barbershop,salon,spa,mixed',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'province' => 'required|string|max:100',
            'canton' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'business_hours' => 'nullable|array',
            'accepts_walk_ins' => 'boolean',
            'offers_home_service' => 'boolean',
            'min_booking_hours' => 'integer|min:0',
            'cancellation_hours' => 'integer|min:0',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        // Convertir business_hours a JSON
        if (isset($validated['business_hours'])) {
            $validated['business_hours'] = json_encode($validated['business_hours']);
        }

        $establishment->update($validated);

        return redirect()->route('business.establishment.show', $establishment)
            ->with('success', 'Establecimiento actualizado exitosamente');
    }

    public function destroy(Establishment $establishment)
    {
        $establishment->delete();

        return redirect()->route('business.dashboard')
            ->with('success', 'Establecimiento eliminado exitosamente');
    }
}
