<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Establishment;
use App\Models\EstablishmentExpense;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Obtener el establecimiento activo o el primero disponible
        $establishment = null;

        if ($user->active_establishment_id) {
            $establishment = Establishment::where('id', $user->active_establishment_id)
                ->where(function ($query) use ($user) {
                    $query->where('owner_id', $user->id)
                        ->orWhereHas('users', function ($q) use ($user) {
                            $q->where('user_id', $user->id);
                        });
                })
                ->with(['users', 'services'])
                ->first();
        }

        if (!$establishment) {
            // Fallback: obtener el primero disponible
            $establishment = Establishment::where('owner_id', $user->id)
                ->orWhereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->with(['users', 'services'])
                ->first();
            
            // Actualizar el activo si encontramos uno
            if ($establishment) {
                $user->update(['active_establishment_id' => $establishment->id]);
            }
        }

        if (!$establishment) {
            return Inertia::render('business/no-establishment');
        }

        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        // === ESTADÍSTICAS ===
        
        // Ingresos
        $todayRevenue = Transaction::where('establishment_id', $establishment->id)
            ->whereDate('paid_at', $today)
            ->where('status', 'completed')
            ->sum('total');

        $weekRevenue = Transaction::where('establishment_id', $establishment->id)
            ->where('paid_at', '>=', $startOfWeek)
            ->where('status', 'completed')
            ->sum('total');

        $monthRevenue = Transaction::where('establishment_id', $establishment->id)
            ->where('paid_at', '>=', $startOfMonth)
            ->where('status', 'completed')
            ->sum('total');

        // Citas
        $todayAppointments = Appointment::where('establishment_id', $establishment->id)
            ->whereDate('scheduled_at', $today)
            ->count();

        $pendingAppointments = Appointment::where('establishment_id', $establishment->id)
            ->whereDate('scheduled_at', $today)
            ->where('status', 'pending')
            ->count();

        // Personal activo (usuarios que tienen citas hoy)
        $totalStaff = $establishment->users()->count();
        $activeStaffIds = Appointment::where('establishment_id', $establishment->id)
            ->whereDate('scheduled_at', $today)
            ->distinct()
            ->pluck('professional_id');
        $activeStaff = $activeStaffIds->count();

        // Calificación promedio
        $rating = $establishment->reviews()->avg('rating') ?? 0;
        $totalReviews = $establishment->reviews()->count();

        // Clientes nuevos este mes
        $newClients = User::where('tenant_id', $establishment->tenant_id)
            ->where('type', 'client')
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        // === TOP PERFORMERS ===
        $topStaff = $establishment->users()
            ->get()
            ->map(function ($user) use ($startOfMonth) {
                $appointments = Appointment::where('professional_id', $user->id)
                    ->where('scheduled_at', '>=', $startOfMonth)
                    ->where('status', 'completed')
                    ->count();

                $revenue = Transaction::where('professional_id', $user->id)
                    ->where('paid_at', '>=', $startOfMonth)
                    ->where('status', 'completed')
                    ->sum('total');

                $rating = $user->reviews()
                    ->where('created_at', '>=', $startOfMonth)
                    ->avg('rating') ?? 0;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'appointments' => $appointments,
                    'revenue' => $revenue,
                    'rating' => round($rating, 1),
                    'employment_type' => $user->pivot->employment_type ?? 'employee',
                    'commission_model' => $user->pivot->commission_model ?? 'percentage',
                ];
            })
            ->sortByDesc('revenue')
            ->take(5)
            ->values();

        // === ACTIVIDAD RECIENTE ===
        $recentAppointments = Appointment::where('establishment_id', $establishment->id)
            ->with(['customer', 'professional', 'service'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'type' => 'appointment',
                    'message' => "Nueva cita de {$appointment->customer->name} con {$appointment->professional->name}",
                    'time' => $appointment->created_at->diffForHumans(),
                    'status' => $appointment->status,
                ];
            });

        // === PRODUCTOS CON STOCK BAJO ===
        // TODO: Implementar cuando se cree el módulo de inventario
        $lowStockProducts = [];

        // === GASTOS DEL MES ===
        $monthExpenses = EstablishmentExpense::where('establishment_id', $establishment->id)
            ->where('expense_date', '>=', $startOfMonth)
            ->sum('amount');

        // === INGRESOS POR DÍA (últimos 7 días) ===
        $dailyRevenue = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $revenue = Transaction::where('establishment_id', $establishment->id)
                ->whereDate('paid_at', $date)
                ->where('status', 'completed')
                ->sum('total');
            
            $dailyRevenue[] = [
                'date' => $date->format('D'),
                'amount' => $revenue,
            ];
        }

        // Calcular el max para normalizar el gráfico
        $maxRevenue = collect($dailyRevenue)->max('amount');

        return Inertia::render('business/dashboard', [
            'establishment' => [
                'id' => $establishment->id,
                'name' => $establishment->name,
                'type' => $establishment->type,
                'address' => $establishment->address,
                'phone' => $establishment->phone,
                'rating' => round($establishment->rating ?? 0, 1),
            ],
            'stats' => [
                'todayRevenue' => $todayRevenue,
                'weekRevenue' => $weekRevenue,
                'monthRevenue' => $monthRevenue,
                'todayAppointments' => $todayAppointments,
                'pendingAppointments' => $pendingAppointments,
                'activeStaff' => $activeStaff,
                'totalStaff' => $totalStaff,
                'rating' => round($rating, 1),
                'totalReviews' => $totalReviews,
                'newClients' => $newClients,
                'monthExpenses' => $monthExpenses,
            ],
            'topStaff' => $topStaff,
            'recentActivity' => $recentAppointments,
            'lowStockProducts' => $lowStockProducts,
            'dailyRevenue' => $dailyRevenue,
            'maxRevenue' => $maxRevenue,
        ]);
    }
}
