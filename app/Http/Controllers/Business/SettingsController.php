<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('business/settings/index');
    }

    public function update(Request $request)
    {
        // Configuración global del usuario (notificaciones, etc.)
        // Por ahora solo retorna, se implementará cuando hayan configuraciones de usuario
        return redirect()->route('business.settings')
            ->with('success', 'Configuración actualizada exitosamente');
    }
}
