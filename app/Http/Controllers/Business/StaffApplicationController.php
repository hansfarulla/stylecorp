<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\StaffApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffApplicationController extends Controller
{
    public function index()
    {
        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo');
        }

        $applications = StaffApplication::whereHas('offer', function($query) use ($establishment) {
                $query->where('establishment_id', $establishment->id);
            })
            ->with(['offer.workstation', 'user'])
            ->latest()
            ->get();

        return Inertia::render('business/applications/index', [
            'applications' => $applications,
            'establishment' => $establishment,
        ]);
    }

    public function approve(Request $request, StaffApplication $application)
    {
        $application->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // Crear usuario si no existe
        if (!$application->user_id) {
            $user = User::create([
                'tenant_id' => auth()->user()->tenant_id,
                'name' => $application->applicant_name,
                'email' => $application->applicant_email,
                'phone' => $application->applicant_phone,
                'password' => bcrypt('password'),
                'role' => 'staff',
                'type' => 'establishment',
                'status' => 'active',
            ]);

            $application->update(['user_id' => $user->id]);
        }

        // Asignar a la estación
        $offer = $application->offer;
        $workstation = $offer->workstation;

        $workstation->update([
            'assigned_user_id' => $application->user_id,
            'status' => 'occupied',
        ]);

        // Vincular con establecimiento
        $establishment = Establishment::where('owner_id', auth()->id())->first();
        $establishment->users()->attach($application->user_id, [
            'employment_type' => $offer->employment_type,
            'commission_model' => $offer->commission_model,
            'commission_percentage' => $offer->commission_percentage,
            'base_salary' => $offer->base_salary,
            'booth_rental_fee' => $offer->booth_rental_fee,
            'status' => 'active',
            'start_date' => now(),
        ]);

        // Cerrar oferta
        $offer->update(['status' => 'filled']);

        return redirect()->route('business.applications.index')
            ->with('success', 'Solicitud aprobada y empleado asignado');
    }

    public function reject(Request $request, StaffApplication $application)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return redirect()->route('business.applications.index')
            ->with('success', 'Solicitud rechazada');
    }
}
