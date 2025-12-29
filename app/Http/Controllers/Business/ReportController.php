<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Establishment;
use App\Models\Transaction;
use App\Models\EstablishmentExpense;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
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

        $period = $request->get('period', 'month');
        $startDate = match($period) {
            'today' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        // Ingresos
        $revenue = Transaction::where('establishment_id', $establishment->id)
            ->where('paid_at', '>=', $startDate)
            ->where('status', 'completed')
            ->sum('total');

        // Gastos
        $expenses = EstablishmentExpense::where('establishment_id', $establishment->id)
            ->where('expense_date', '>=', $startDate)
            ->sum('amount');

        // Citas
        $appointments = Appointment::where('establishment_id', $establishment->id)
            ->where('scheduled_at', '>=', $startDate)
            ->count();

        $completedAppointments = Appointment::where('establishment_id', $establishment->id)
            ->where('scheduled_at', '>=', $startDate)
            ->where('status', 'completed')
            ->count();

        // Por profesional
        $staffPerformance = $establishment->users()
            ->get()
            ->map(function ($user) use ($startDate) {
                $appointments = Appointment::where('professional_id', $user->id)
                    ->where('scheduled_at', '>=', $startDate)
                    ->where('status', 'completed')
                    ->count();

                $revenue = Transaction::where('professional_id', $user->id)
                    ->where('paid_at', '>=', $startDate)
                    ->where('status', 'completed')
                    ->sum('total');

                return [
                    'name' => $user->name,
                    'appointments' => $appointments,
                    'revenue' => $revenue,
                ];
            });

        return Inertia::render('business/reports/index', [
            'establishment' => $establishment,
            'period' => $period,
            'summary' => [
                'revenue' => $revenue,
                'expenses' => $expenses,
                'netProfit' => $revenue - $expenses,
                'appointments' => $appointments,
                'completedAppointments' => $completedAppointments,
                'completionRate' => $appointments > 0 ? round(($completedAppointments / $appointments) * 100, 1) : 0,
            ],
            'staffPerformance' => $staffPerformance,
        ]);
    }

    public function financial(Request $request)
    {
        // Reporte financiero detallado
        return Inertia::render('business/reports/financial');
    }

    public function export(Request $request)
    {
        // Exportar reportes
        return response()->json(['message' => 'Exportación en desarrollo']);
    }
}
