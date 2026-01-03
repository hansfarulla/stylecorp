<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar columna category_id solo si no existe
        if (!Schema::hasColumn('services', 'category_id')) {
            Schema::table('services', function (Blueprint $table) {
                $table->foreignId('category_id')->nullable()->after('slug')->constrained('service_categories')->nullOnDelete();
            });
        }

        // Migrar datos existentes: crear categorías por defecto y asignarlas
        $this->migrateExistingCategories();

        // Eliminar la columna category (enum) solo si existe
        if (Schema::hasColumn('services', 'category')) {
            Schema::table('services', function (Blueprint $table) {
                $table->dropColumn('category');
            });
        }

        // Hacer category_id requerido solo si existe y es nullable
        if (Schema::hasColumn('services', 'category_id')) {
            Schema::table('services', function (Blueprint $table) {
                $table->foreignId('category_id')->nullable(false)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restaurar columna category como enum solo si no existe
        if (!Schema::hasColumn('services', 'category')) {
            Schema::table('services', function (Blueprint $table) {
                $table->enum('category', ['cut', 'beard', 'coloring', 'styling', 'treatment', 'waxing', 'facial', 'massage', 'nails', 'makeup', 'other'])->default('cut')->after('slug');
            });

            // Migrar datos de vuelta solo si ambas columnas existen
            if (Schema::hasColumn('services', 'category_id')) {
                DB::table('services')
                    ->join('service_categories', 'services.category_id', '=', 'service_categories.id')
                    ->update(['services.category' => DB::raw('service_categories.slug')]);
            }
        }

        // Eliminar columna category_id solo si existe
        if (Schema::hasColumn('services', 'category_id')) {
            Schema::table('services', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
                $table->dropColumn('category_id');
            });
        }
    }

    /**
     * Migrar categorías existentes
     */
    private function migrateExistingCategories(): void
    {
        $defaultCategories = [
            ['slug' => 'cut', 'name' => 'Corte', 'icon' => '✂️', 'color' => '#3b82f6', 'order' => 1],
            ['slug' => 'beard', 'name' => 'Barba', 'icon' => '🧔', 'color' => '#8b5cf6', 'order' => 2],
            ['slug' => 'coloring', 'name' => 'Coloración', 'icon' => '🎨', 'color' => '#ec4899', 'order' => 3],
            ['slug' => 'styling', 'name' => 'Peinado', 'icon' => '💇', 'color' => '#f59e0b', 'order' => 4],
            ['slug' => 'treatment', 'name' => 'Tratamiento', 'icon' => '💆', 'color' => '#10b981', 'order' => 5],
            ['slug' => 'waxing', 'name' => 'Depilación', 'icon' => '🪒', 'color' => '#06b6d4', 'order' => 6],
            ['slug' => 'facial', 'name' => 'Facial', 'icon' => '🧖', 'color' => '#84cc16', 'order' => 7],
            ['slug' => 'massage', 'name' => 'Masaje', 'icon' => '💆‍♀️', 'color' => '#a855f7', 'order' => 8],
            ['slug' => 'nails', 'name' => 'Uñas', 'icon' => '💅', 'color' => '#f43f5e', 'order' => 9],
            ['slug' => 'makeup', 'name' => 'Maquillaje', 'icon' => '💄', 'color' => '#d946ef', 'order' => 10],
            ['slug' => 'other', 'name' => 'Otro', 'icon' => '✨', 'color' => '#64748b', 'order' => 11],
        ];

        // Obtener todos los establecimientos únicos de los servicios existentes
        $establishments = DB::table('services')
            ->select('establishment_id', 'tenant_id')
            ->whereNotNull('establishment_id')
            ->distinct()
            ->get();

        foreach ($establishments as $establishment) {
            // Obtener categorías únicas usadas por este establecimiento
            $usedCategories = DB::table('services')
                ->where('establishment_id', $establishment->establishment_id)
                ->distinct()
                ->pluck('category');

            foreach ($usedCategories as $categorySlug) {
                $categoryData = collect($defaultCategories)->firstWhere('slug', $categorySlug);
                
                if ($categoryData) {
                    // Crear la categoría
                    $categoryId = DB::table('service_categories')->insertGetId([
                        'tenant_id' => $establishment->tenant_id,
                        'establishment_id' => $establishment->establishment_id,
                        'name' => $categoryData['name'],
                        'slug' => $categoryData['slug'],
                        'icon' => $categoryData['icon'],
                        'color' => $categoryData['color'],
                        'order' => $categoryData['order'],
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Actualizar servicios con esta categoría
                    DB::table('services')
                        ->where('establishment_id', $establishment->establishment_id)
                        ->where('category', $categorySlug)
                        ->update(['category_id' => $categoryId]);
                }
            }
        }
    }
};
