<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::where('professional_id', $user->id)
            ->with(['customer', 'service', 'establishment'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(20);

        return Inertia::render('professional/appointments/index', [
            'appointments' => $appointments,
        ]);
    }

    public function show(Appointment $appointment)
    {
        // Verificar que la cita pertenece al profesional autenticado
        if ($appointment->professional_id !== auth()->id()) {
            abort(403, 'No tienes acceso a esta cita');
        }

        $appointment->load(['customer', 'service', 'establishment', 'reviews']);

        return Inertia::render('professional/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        // Verificar que la cita pertenece al profesional autenticado
        if ($appointment->professional_id !== auth()->id()) {
            abort(403, 'No tienes acceso a esta cita');
        }

        $validated = $request->validate([
            'status' => 'required|in:in_progress,completed,no_show',
        ]);

        $appointment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Estado de la cita actualizado');
    }
}
