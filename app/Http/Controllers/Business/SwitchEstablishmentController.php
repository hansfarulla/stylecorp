<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SwitchEstablishmentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'establishment_id' => 'required|exists:establishments,id',
        ]);

        $user = auth()->user();

        // Verificar que el establecimiento pertenezca al usuario
        $establishment = $user->establishments()
            ->where('id', $validated['establishment_id'])
            ->first();

        if (!$establishment) {
            return back()->with('error', 'No tienes acceso a este establecimiento');
        }

        // Cambiar establecimiento activo
        $user->update(['active_establishment_id' => $establishment->id]);

        return back()->with('success', 'Establecimiento cambiado a: ' . $establishment->name);
    }
}
