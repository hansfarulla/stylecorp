<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Establishment;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function show(User $customer)
    {
        $user = auth()->user();
        
        // Get current establishment
        $establishment = Establishment::where('owner_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        if (!$establishment) {
            return redirect()->route('business.dashboard');
        }

        // Load appointments for this customer at this establishment
        $appointments = Appointment::where('establishment_id', $establishment->id)
            ->where('customer_id', $customer->id)
            ->with(['service', 'professional'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        // Calculate stats
        $stats = [
            'total_appointments' => $appointments->count(),
            'completed_appointments' => $appointments->where('status', 'completed')->count(),
            'cancelled_appointments' => $appointments->whereIn('status', ['cancelled_by_customer', 'cancelled_by_establishment', 'no_show'])->count(),
            'total_spent' => $appointments->where('status', 'completed')->sum('total'),
            'last_visit' => $appointments->where('status', 'completed')->first()?->scheduled_at,
        ];

        return Inertia::render('business/customers/show', [
            'customer' => $customer,
            'appointments' => $appointments,
            'stats' => $stats,
        ]);
    }
}
