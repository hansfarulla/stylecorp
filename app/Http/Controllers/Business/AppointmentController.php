<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Establishment;
use App\Models\EstablishmentUser;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
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

        $query = Appointment::where('establishment_id', $establishment->id)
            ->with(['customer', 'professional', 'service']);

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')->paginate(100);

        // Data for create modal
        $services = Service::where('establishment_id', $establishment->id)->get();
        $professionals = $establishment->users;
        
        // Only show customers who have previously booked with this establishment
        $customers = User::whereHas('appointments', function ($query) use ($establishment) {
            $query->where('establishment_id', $establishment->id);
        })->get();

        return Inertia::render('business/appointments/index', [
            'appointments' => $appointments,
            'filters' => $request->only(['status', 'date']),
            'services' => $services,
            'professionals' => $professionals,
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();

        $services = Service::where('establishment_id', $establishment->id)->get();
        $professionals = $establishment->users;
        $customers = User::where('tenant_id', $user->tenant_id)
            ->where('type', 'client')
            ->get();

        return Inertia::render('business/appointments/create', [
            'services' => $services,
            'professionals' => $professionals,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'professional_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_at' => 'required|date|after:now',
            'location_type' => 'required|in:in_store,home_service',
            'customer_notes' => 'nullable|string',
        ]);

        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();
        $service = Service::findOrFail($validated['service_id']);

        $scheduledAt = \Carbon\Carbon::parse($validated['scheduled_at']);
        $scheduledEndAt = $scheduledAt->copy()->addMinutes($service->duration_minutes);

        $establishmentUser = EstablishmentUser::where('establishment_id', $establishment->id)
            ->where('user_id', $validated['professional_id'])
            ->first();

        // Appointments created by business require customer acceptance
        $status = 'pending';

        $appointment = Appointment::create([
            'tenant_id' => $user->tenant_id,
            'establishment_id' => $establishment->id,
            'customer_id' => $validated['customer_id'],
            'professional_id' => $validated['professional_id'],
            'service_id' => $validated['service_id'],
            'booking_code' => 'APT-' . strtoupper(substr(md5(time()), 0, 8)),
            'scheduled_at' => $scheduledAt,
            'scheduled_end_at' => $scheduledEndAt,
            'duration_minutes' => $service->duration_minutes,
            'location_type' => $validated['location_type'],
            'service_price' => $service->base_price,
            'subtotal' => $service->base_price,
            'discount' => 0,
            'total' => $service->base_price,
            'status' => $status,
            'customer_notes' => $validated['customer_notes'] ?? null,
        ]);

        return redirect()->route('business.appointments.show', $appointment)
            ->with('success', 'Cita solicitada. Esperando confirmación del cliente.');
    }

    public function show(Appointment $appointment)
    {
        $appointment->load(['customer', 'professional', 'service', 'establishment']);

        return Inertia::render('business/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function edit(Appointment $appointment)
    {
        $user = auth()->user();
        $establishment = Establishment::where('owner_id', $user->id)->first();

        $services = Service::where('establishment_id', $establishment->id)->get();
        $professionals = $establishment->users;

        $appointment->load(['customer', 'professional', 'service']);

        return Inertia::render('business/appointments/edit', [
            'appointment' => $appointment,
            'services' => $services,
            'professionals' => $professionals,
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'professional_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_at' => 'required|date',
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled_by_customer,cancelled_by_establishment,no_show',
            'customer_notes' => 'nullable|string',
            'professional_notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($validated['service_id']);
        $scheduledAt = \Carbon\Carbon::parse($validated['scheduled_at']);
        $scheduledEndAt = $scheduledAt->copy()->addMinutes($service->duration_minutes);

        $appointment->update([
            'professional_id' => $validated['professional_id'],
            'service_id' => $validated['service_id'],
            'scheduled_at' => $scheduledAt,
            'scheduled_end_at' => $scheduledEndAt,
            'duration_minutes' => $service->duration_minutes,
            'status' => $validated['status'],
            'customer_notes' => $validated['customer_notes'] ?? null,
            'professional_notes' => $validated['professional_notes'] ?? null,
        ]);

        return redirect()->route('business.appointments.show', $appointment)
            ->with('success', 'Cita actualizada exitosamente');
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled_by_customer,cancelled_by_establishment,no_show',
        ]);

        $appointment->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Estado de la cita actualizado exitosamente');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('business.appointments.index')
            ->with('success', 'Cita eliminada exitosamente');
    }
}
