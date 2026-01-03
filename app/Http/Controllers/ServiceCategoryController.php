<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ServiceCategoryController extends Controller
{
    public function index(): Response
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);
        
        $categories = ServiceCategory::where('establishment_id', $establishment->id)
            ->withCount('services')
            ->ordered()
            ->get();

        return Inertia::render('business/service-categories/index', [
            'categories' => $categories,
            'establishment' => $establishment,
        ]);
    }

    public function create(): Response
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);

        return Inertia::render('business/service-categories/create', [
            'establishment' => $establishment,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug,NULL,id,establishment_id,' . $establishment->id,
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string|max:1000',
            'order' => 'nullable|integer|min:0',
        ]);

        ServiceCategory::create([
            ...$validated,
            'establishment_id' => $establishment->id,
            'is_active' => true,
        ]);

        return redirect()->route('business.service-categories.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    public function edit(ServiceCategory $serviceCategory): Response
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);
        
        // Verificar que la categoría pertenece al establecimiento activo
        if ($serviceCategory->establishment_id !== $establishment->id) {
            abort(403);
        }

        return Inertia::render('business/service-categories/edit', [
            'category' => $serviceCategory->load('services:id,name,category_id'),
            'establishment' => $establishment,
        ]);
    }

    public function update(Request $request, ServiceCategory $serviceCategory): RedirectResponse
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);
        
        // Verificar que la categoría pertenece al establecimiento activo
        if ($serviceCategory->establishment_id !== $establishment->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug,' . $serviceCategory->id . ',id,establishment_id,' . $establishment->id,
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string|max:1000',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $serviceCategory->update($validated);

        return redirect()->route('business.service-categories.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy(ServiceCategory $serviceCategory): RedirectResponse
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);
        
        // Verificar que la categoría pertenece al establecimiento activo
        if ($serviceCategory->establishment_id !== $establishment->id) {
            abort(403);
        }

        // Verificar si tiene servicios asociados
        if ($serviceCategory->services()->count() > 0) {
            return redirect()->route('business.service-categories.index')
                ->with('error', 'No se puede eliminar una categoría que tiene servicios asociados');
        }

        $serviceCategory->delete();

        return redirect()->route('business.service-categories.index')
            ->with('success', 'Categoría eliminada exitosamente');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $establishment = Establishment::findOrFail(auth()->user()->active_establishment_id);

        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:service_categories,id',
            'categories.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['categories'] as $categoryData) {
            ServiceCategory::where('id', $categoryData['id'])
                ->where('establishment_id', $establishment->id)
                ->update(['order' => $categoryData['order']]);
        }

        return redirect()->route('business.service-categories.index')
            ->with('success', 'Orden actualizado exitosamente');
    }
}
