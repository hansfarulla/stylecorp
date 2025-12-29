<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo. Crea o selecciona uno.');
        }

        $staff = $establishment->users()
            ->withPivot(['employment_type', 'commission_model', 'commission_percentage', 'base_salary', 'booth_rental_fee', 'status', 'auto_accept_appointments'])
            ->get();

        return Inertia::render('business/staff/index', [
            'staff' => $staff,
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

        // Obtener estaciones disponibles
        $workstations = $establishment->workstations()
            ->select('id', 'name', 'number')
            ->orderBy('number')
            ->get();

        return Inertia::render('business/staff/create', [
            'establishment' => $establishment,
            'workstations' => $workstations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:staff,manager',
            'employment_type' => 'required|in:employee,freelancer',
            'commission_model' => 'required|in:percentage,salary_plus,booth_rental,fixed_per_service,salary_only',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'base_salary' => 'nullable|numeric|min:0',
            'booth_rental_fee' => 'nullable|numeric|min:0',
            'auto_accept_appointments' => 'nullable|boolean',
            'workstation_id' => 'nullable|exists:workstations,id',
            'workstation_start_time' => 'nullable|date_format:H:i',
            'workstation_end_time' => 'nullable|date_format:H:i',
            'workstation_notes' => 'nullable|string|max:500',
        ]);

        $establishment = auth()->user()->activeEstablishment;

        if (!$establishment) {
            return back()->with('error', 'No tienes un establecimiento activo');
        }

        // Crear usuario
        $newUser = User::create([
            'tenant_id' => auth()->user()->tenant_id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => bcrypt('password'), // Contraseña temporal
            'role' => $validated['role'],
            'type' => 'establishment',
            'status' => 'active',
        ]);

        // Vincular con establecimiento
        $establishment->users()->attach($newUser->id, [
            'role' => $validated['role'],
            'employment_type' => $validated['employment_type'],
            'commission_model' => $validated['commission_model'],
            'commission_percentage' => $validated['commission_percentage'] ?? null,
            'base_salary' => $validated['base_salary'] ?? null,
            'booth_rental_fee' => $validated['booth_rental_fee'] ?? null,
            'auto_accept_appointments' => $validated['auto_accept_appointments'] ?? false,
            'status' => 'active',
            'start_date' => now(),
        ]);

        // Asignar a estación de trabajo si se especificó
        if (!empty($validated['workstation_id'])) {
            $workstation = $establishment->workstations()->find($validated['workstation_id']);
            if ($workstation) {
                $workstation->assignedUsers()->attach($newUser->id, [
                    'start_time' => $validated['workstation_start_time'] ?? null,
                    'end_time' => $validated['workstation_end_time'] ?? null,
                    'notes' => $validated['workstation_notes'] ?? null,
                ]);
            }
        }

        return redirect()->route('business.staff.index')
            ->with('success', 'Empleado agregado exitosamente. Contraseña temporal: password');
    }

    public function show(User $staff)
    {
        $establishment = auth()->user()->activeEstablishment;
        
        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo');
        }
        
        // Cargar las estaciones asignadas con datos del pivot
        $staff->load(['workstations' => function ($query) {
            $query->withPivot(['start_time', 'end_time', 'notes']);
        }]);
        
        $pivotData = $establishment->users()
            ->where('user_id', $staff->id)
            ->first()
            ?->pivot;

        // Load appointments for this staff member at this establishment
        $appointments = \App\Models\Appointment::where('establishment_id', $establishment->id)
            ->where('professional_id', $staff->id)
            ->with(['service', 'customer'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        // Calculate stats
        $stats = [
            'total_appointments' => $appointments->count(),
            'completed_appointments' => $appointments->where('status', 'completed')->count(),
            'upcoming_appointments' => $appointments->whereIn('status', ['pending', 'confirmed'])->count(),
            'total_revenue' => $appointments->where('status', 'completed')->sum('total'),
        ];

        return Inertia::render('business/staff/show', [
            'staff' => $staff,
            'pivotData' => $pivotData,
            'appointments' => $appointments,
            'stats' => $stats,
        ]);
    }

    public function edit(User $staff)
    {
        $establishment = auth()->user()->activeEstablishment;
        
        if (!$establishment) {
            return redirect()->route('business.dashboard')
                ->with('error', 'No tienes un establecimiento activo');
        }
        
        // Cargar las estaciones asignadas con datos del pivot
        $staff->load(['workstations' => function ($query) {
            $query->withPivot(['start_time', 'end_time', 'notes']);
        }]);
        
        $pivotData = $establishment->users()
            ->where('user_id', $staff->id)
            ->first()
            ?->pivot;

        // Obtener todas las estaciones disponibles del establecimiento
        $workstations = $establishment->workstations()
            ->select('id', 'name', 'number')
            ->orderBy('number')
            ->get();

        return Inertia::render('business/staff/edit', [
            'staff' => $staff,
            'pivotData' => $pivotData,
            'workstations' => $workstations,
        ]);
    }

    public function update(Request $request, User $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $staff->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:staff,manager',
            // employment_type NO se puede cambiar - se omite de la validación
            'commission_model' => 'required|in:percentage,salary_plus,booth_rental,fixed_per_service,salary_only',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'base_salary' => 'nullable|numeric|min:0',
            'booth_rental_fee' => 'nullable|numeric|min:0',
            'auto_accept_appointments' => 'nullable|boolean',
            'workstation_assignments' => 'nullable|array',
            'workstation_assignments.*.workstation_id' => 'required|exists:workstations,id',
            'workstation_assignments.*.start_time' => 'required|date_format:H:i',
            'workstation_assignments.*.end_time' => 'required|date_format:H:i|after:workstation_assignments.*.start_time',
            'workstation_assignments.*.notes' => 'nullable|string|max:500',
            'ignore_conflicts' => 'nullable|boolean',
        ]);

        $staff->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
        ]);

        $establishment = auth()->user()->activeEstablishment;
        
        if (!$establishment) {
            return back()->with('error', 'No tienes un establecimiento activo');
        }
        
        $establishment->users()->updateExistingPivot($staff->id, [
            'role' => $validated['role'],
            // employment_type se mantiene sin cambios
            'commission_model' => $validated['commission_model'],
            'commission_percentage' => $validated['commission_percentage'] ?? null,
            'base_salary' => $validated['base_salary'] ?? null,
            'booth_rental_fee' => $validated['booth_rental_fee'] ?? null,
            'auto_accept_appointments' => $validated['auto_accept_appointments'] ?? false,
        ]);

        // Validate and sync workstation assignments with schedule conflict checking
        if (isset($validated['workstation_assignments']) && is_array($validated['workstation_assignments'])) {
            $syncData = [];
            $conflicts = [];
            $ignoreConflicts = $validated['ignore_conflicts'] ?? false;

            foreach ($validated['workstation_assignments'] as $index => $assignment) {
                $workstationId = $assignment['workstation_id'];
                $startTime = $assignment['start_time'];
                $endTime = $assignment['end_time'];
                $notes = $assignment['notes'] ?? null;

                // Check for conflicts with other staff members on the same workstation
                $conflict = \DB::table('workstation_user')
                    ->join('users', 'workstation_user.user_id', '=', 'users.id')
                    ->where('workstation_user.workstation_id', $workstationId)
                    ->where('workstation_user.user_id', '!=', $staff->id)
                    ->where(function ($query) use ($startTime, $endTime) {
                        // Check if the time ranges overlap
                        $query->where(function ($q) use ($startTime, $endTime) {
                            $q->where('workstation_user.start_time', '<=', $startTime)
                              ->where('workstation_user.end_time', '>', $startTime);
                        })->orWhere(function ($q) use ($startTime, $endTime) {
                            $q->where('workstation_user.start_time', '<', $endTime)
                              ->where('workstation_user.end_time', '>=', $endTime);
                        })->orWhere(function ($q) use ($startTime, $endTime) {
                            $q->where('workstation_user.start_time', '>=', $startTime)
                              ->where('workstation_user.end_time', '<=', $endTime);
                        });
                    })
                    ->select('users.name', 'workstation_user.start_time', 'workstation_user.end_time')
                    ->first();

                if ($conflict && !$ignoreConflicts) {
                    // Store conflict as a warning, not a hard error
                    $conflicts["workstation_assignments.{$index}.workstation_id"] = 
                        "Conflicto de horario con {$conflict->name} ({$conflict->start_time} - {$conflict->end_time})";
                }
                
                // Always add to syncData (will be synced if conflicts are ignored or none exist)
                $syncData[$workstationId] = [
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'notes' => $notes,
                ];
            }

            // If there are conflicts and user hasn't confirmed to ignore them, return warnings
            if (!empty($conflicts) && !$ignoreConflicts) {
                return back()->withErrors($conflicts)->withInput();
            }

            // Sync workstations with validated schedule data
            $staff->workstations()->sync($syncData);
        } else {
            // If no workstation_assignments provided, detach all
            $staff->workstations()->detach();
        }

        return redirect()->route('business.staff.show', $staff)
            ->with('success', 'Empleado actualizado exitosamente');
    }

    public function destroy(User $staff)
    {
        $establishment = Establishment::where('owner_id', auth()->id())->first();
        
        $establishment->users()->detach($staff->id);

        return redirect()->route('business.staff.index')
            ->with('success', 'Empleado removido del establecimiento');
    }
}
