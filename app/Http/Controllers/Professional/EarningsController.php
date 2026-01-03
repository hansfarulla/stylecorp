<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class EarningsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $period = $request->input('period', 'month'); // day, week, month, year
        
        $startDate = match($period) {
            'day' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        // Citas completadas
        $completedAppointments = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->whereBetween('scheduled_at', [$startDate, Carbon::now()])
            ->with(['service', 'customer'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        $totalEarnings = $completedAppointments->sum('total');
        
        // Ganancias por día (para gráfico)
        $earningsByDay = $completedAppointments
            ->groupBy(fn($appointment) => Carbon::parse($appointment->scheduled_at)->format('Y-m-d'))
            ->map(fn($group) => $group->sum('total'))
            ->toArray();

        return Inertia::render('professional/earnings/index', [
            'totalEarnings' => $totalEarnings,
            'completedAppointments' => $completedAppointments,
            'earningsByDay' => $earningsByDay,
            'period' => $period,
        ]);
    }
}
