<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\Workstation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkstationController extends Controller
{
    public function index()
    {
        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo. Crea o selecciona uno.');
        }

        $workstations = $establishment->workstations()
            ->with(['assignedUser', 'assignedUsers'])
            ->orderBy('number')
            ->get();

        // Obtener personal del establecimiento para asignación
        $staff = $establishment->users()
            ->where('users.status', 'active')
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return Inertia::render('business/workstations/index', [
            'workstations' => $workstations,
            'establishment' => $establishment,
            'staff' => $staff,
        ]);
    }

    public function show(Workstation $workstation)
    {
        $workstation->load(['assignedUsers' => function ($query) {
            $query->select('users.id', 'users.name', 'users.email');
        }]);

        return Inertia::render('business/workstations/show', [
            'workstation' => $workstation,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'number' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'schedule' => 'nullable|array',
            'assigned_users' => 'nullable|array',
            'assigned_users.*.user_id' => 'required|exists:users,id',
            'assigned_users.*.start_time' => 'nullable|date_format:H:i',
            'assigned_users.*.end_time' => 'nullable|date_format:H:i',
            'assigned_users.*.days' => 'nullable|array',
            'assigned_users.*.notes' => 'nullable|string|max:500',
        ]);

        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return back()->with('error', 'No tienes un establecimiento activo');
        }

        $workstation = $establishment->workstations()->create([
            'name' => $validated['name'],
            'number' => $validated['number'] ?? null,
            'description' => $validated['description'] ?? null,
            'schedule' => $validated['schedule'] ?? null,
            'status' => 'available',
        ]);

        // Sincronizar asignaciones de usuarios si se proporcionaron
        if (!empty($validated['assigned_users'])) {
            $syncData = [];
            foreach ($validated['assigned_users'] as $assignment) {
                $syncData[$assignment['user_id']] = [
                    'start_time' => $assignment['start_time'] ?? null,
                    'end_time' => $assignment['end_time'] ?? null,
                    'days' => isset($assignment['days']) ? json_encode($assignment['days']) : null,
                    'notes' => $assignment['notes'] ?? null,
                ];
            }
            $workstation->assignedUsers()->sync($syncData);
        }

        return redirect()->route('business.workstations.index')
            ->with('success', 'Estación de trabajo creada exitosamente');
    }

    public function update(Request $request, Workstation $workstation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'number' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:available,occupied,maintenance,disabled',
            'assigned_user_id' => 'nullable|exists:users,id',
            'schedule' => 'nullable|array',
            'assigned_users' => 'nullable|array',
            'assigned_users.*.user_id' => 'required|exists:users,id',
            'assigned_users.*.start_time' => 'nullable|date_format:H:i',
            'assigned_users.*.end_time' => 'nullable|date_format:H:i',
            'assigned_users.*.days' => 'nullable|array',
            'assigned_users.*.notes' => 'nullable|string|max:500',
        ]);

        $workstation->update([
            'name' => $validated['name'],
            'number' => $validated['number'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'assigned_user_id' => $validated['assigned_user_id'] ?? null,
            'schedule' => $validated['schedule'] ?? null,
        ]);

        // Actualizar asignaciones de usuarios con horarios
        if (isset($validated['assigned_users'])) {
            $syncData = [];
            foreach ($validated['assigned_users'] as $assignment) {
                $syncData[$assignment['user_id']] = [
                    'start_time' => $assignment['start_time'] ?? null,
                    'end_time' => $assignment['end_time'] ?? null,
                    'days' => isset($assignment['days']) ? json_encode($assignment['days']) : null,
                    'notes' => $assignment['notes'] ?? null,
                ];
            }
            $workstation->assignedUsers()->sync($syncData);
        } else {
            // Si no hay asignaciones, limpiar todas
            $workstation->assignedUsers()->detach();
        }

        return redirect()->route('business.workstations.index')
            ->with('success', 'Estación actualizada exitosamente');
    }

    public function destroy(Workstation $workstation)
    {
        $workstation->delete();

        return redirect()->route('business.workstations.index')
            ->with('success', 'Estación eliminada exitosamente');
    }
}
