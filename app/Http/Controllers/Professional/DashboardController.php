<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Transaction;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Verificar que sea un profesional
        if (!in_array($user->role, ['staff', 'freelancer'])) {
            abort(403, 'Acceso denegado');
        }

        $today = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();
        $monthStart = Carbon::now()->startOfMonth();

        // Citas de hoy
        $todayAppointments = Appointment::where('professional_id', $user->id)
            ->whereDate('scheduled_at', $today)
            ->with(['customer', 'service'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'booking_code' => $appointment->booking_code,
                    'client' => $appointment->customer->name,
                    'service' => $appointment->service->name,
                    'time' => Carbon::parse($appointment->scheduled_at)->format('H:i'),
                    'price' => $appointment->total,
                    'status' => $appointment->status,
                    'location_type' => $appointment->location_type,
                ];
            });

        // Próximas citas (siguiente semana)
        $upcomingAppointments = Appointment::where('professional_id', $user->id)
            ->whereDate('scheduled_at', '>', $today)
            ->whereDate('scheduled_at', '<=', Carbon::now()->addWeek())
            ->whereIn('status', ['pending', 'confirmed'])
            ->with(['customer', 'service'])
            ->orderBy('scheduled_at')
            ->limit(5)
            ->get();

        // Ganancias y estadísticas
        $todayEarnings = Appointment::where('professional_id', $user->id)
            ->whereDate('scheduled_at', $today)
            ->whereIn('status', ['completed'])
            ->sum('total');

        $weekEarnings = Appointment::where('professional_id', $user->id)
            ->whereBetween('scheduled_at', [$weekStart, Carbon::now()])
            ->whereIn('status', ['completed'])
            ->sum('total');

        $monthEarnings = Appointment::where('professional_id', $user->id)
            ->whereBetween('scheduled_at', [$monthStart, Carbon::now()])
            ->whereIn('status', ['completed'])
            ->sum('total');

        // Conteo de citas
        $todayAppointmentsCount = $todayAppointments->count();
        $weekAppointmentsCount = Appointment::where('professional_id', $user->id)
            ->whereBetween('scheduled_at', [$weekStart, Carbon::now()])
            ->count();

        // Reviews recientes
        $recentReviews = Review::where('professional_id', $user->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'client' => $review->user->name,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'date' => $review->created_at->format('Y-m-d'),
                ];
            });

        // Rating promedio
        $averageRating = Review::where('professional_id', $user->id)->avg('rating') ?? 0;
        $totalReviews = Review::where('professional_id', $user->id)->count();

        return Inertia::render('professional/dashboard', [
            'stats' => [
                'todayEarnings' => $todayEarnings,
                'weekEarnings' => $weekEarnings,
                'monthEarnings' => $monthEarnings,
                'todayAppointments' => $todayAppointmentsCount,
                'weekAppointments' => $weekAppointmentsCount,
                'rating' => round($averageRating, 1),
                'reviews' => $totalReviews,
            ],
            'todayAppointments' => $todayAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'recentReviews' => $recentReviews,
        ]);
    }
}
