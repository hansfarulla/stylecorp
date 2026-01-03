<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Aquí puedes cargar la disponibilidad del profesional
        // Por ahora retornamos una vista básica

        return Inertia::render('professional/schedule/index', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'schedule' => 'required|array',
        ]);

        // Aquí guardarías la disponibilidad
        // Por ahora solo un placeholder

        return redirect()->back()->with('success', 'Horario actualizado correctamente');
    }
}
