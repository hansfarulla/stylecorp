<?php

use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\DB;

// Health check endpoint para Docker/Kubernetes
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        return response()->json(['status' => 'ok'], 200);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 503);
    }
});

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// OAuth Routes
Route::prefix('auth')->group(function () {
    Route::get('{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('auth.social.redirect');
    Route::get('{provider}/callback', [SocialAuthController::class, 'callback'])->name('auth.social.callback');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard principal - redirige según rol
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Redirigir según el rol del usuario
        if ($user->role === 'customer') {
            return redirect()->route('customer.dashboard');
        }
        
        if (in_array($user->role, ['staff', 'freelancer'])) {
            return redirect()->route('professional.dashboard');
        }
        
        if (in_array($user->role, ['owner', 'manager'])) {
            return redirect()->route('business.dashboard');
        }
        
        // Super admin - puede ver cualquier dashboard
        if ($user->role === 'super_admin') {
            return redirect()->route('business.dashboard');
        }
        
        // Fallback
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Dashboard para clientes
    Route::get('customer/dashboard', function () {
        return Inertia::render('customer/dashboard');
    })->name('customer.dashboard');

    // Dashboard para profesionales (staff y freelancers)
    Route::get('professional/dashboard', function () {
        return Inertia::render('professional/dashboard');
    })->name('professional.dashboard');

    // Dashboard para negocios (owners y managers)
    Route::prefix('business')->name('business.')->middleware('business')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Business\DashboardController::class, 'index'])->name('dashboard');
        
        // Cambiar establecimiento activo
        Route::post('switch-establishment', \App\Http\Controllers\Business\SwitchEstablishmentController::class)->name('switch-establishment');
        
        // Establecimiento
        Route::resource('establishment', \App\Http\Controllers\Business\EstablishmentController::class);
        
        // Cambiar establecimiento activo
        Route::post('switch-establishment', \App\Http\Controllers\Business\SwitchEstablishmentController::class)->name('switch-establishment');
        
        // Estaciones de trabajo (sillas)
        Route::resource('workstations', \App\Http\Controllers\Business\WorkstationController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
        
        // Ofertas de trabajo
        Route::resource('offers', \App\Http\Controllers\Business\WorkstationOfferController::class);
        
        // Solicitudes de personal
        Route::get('applications', [\App\Http\Controllers\Business\StaffApplicationController::class, 'index'])->name('applications.index');
        Route::post('applications/{application}/approve', [\App\Http\Controllers\Business\StaffApplicationController::class, 'approve'])->name('applications.approve');
        Route::post('applications/{application}/reject', [\App\Http\Controllers\Business\StaffApplicationController::class, 'reject'])->name('applications.reject');
        
        // Personal
        Route::resource('staff', \App\Http\Controllers\Business\StaffController::class);
        Route::get('staff/{user}/permissions', [\App\Http\Controllers\Business\StaffPermissionsController::class, 'edit'])->name('staff.permissions.edit');
        Route::put('staff/{user}/permissions', [\App\Http\Controllers\Business\StaffPermissionsController::class, 'update'])->name('staff.permissions.update');
        
        // Citas
        Route::patch('appointments/{appointment}/status', [\App\Http\Controllers\Business\AppointmentController::class, 'updateStatus'])->name('appointments.update-status');
        Route::resource('appointments', \App\Http\Controllers\Business\AppointmentController::class);
        
        // Clientes
        Route::get('customers/{customer}', [\App\Http\Controllers\Business\CustomerController::class, 'show'])->name('customers.show');

        // Servicios
        Route::resource('services', \App\Http\Controllers\Business\ServiceController::class);
        
        // Categorías de Servicios
        Route::resource('service-categories', \App\Http\Controllers\ServiceCategoryController::class)->names('service-categories');
        Route::post('service-categories/update-order', [\App\Http\Controllers\ServiceCategoryController::class, 'updateOrder'])->name('service-categories.update-order');
        
        // Reportes
        Route::get('reports', [\App\Http\Controllers\Business\ReportController::class, 'index'])->name('reports');
        Route::get('reports/financial', [\App\Http\Controllers\Business\ReportController::class, 'financial'])->name('reports.financial');
        Route::get('reports/export', [\App\Http\Controllers\Business\ReportController::class, 'export'])->name('reports.export');
        
        // Configuración
        Route::get('settings', [\App\Http\Controllers\Business\SettingsController::class, 'index'])->name('settings');
        Route::put('settings', [\App\Http\Controllers\Business\SettingsController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
