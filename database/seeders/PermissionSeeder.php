<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Establecimiento
            [
                'name' => 'establishment.view',
                'label' => 'Ver Establecimiento',
                'description' => 'Ver información del establecimiento',
                'category' => 'establishment',
                'order' => 1,
            ],
            [
                'name' => 'establishment.manage',
                'label' => 'Gestionar Establecimiento',
                'description' => 'Crear, editar y eliminar establecimientos',
                'category' => 'establishment',
                'order' => 2,
            ],
            [
                'name' => 'establishment.settings',
                'label' => 'Configurar Establecimiento',
                'description' => 'Modificar configuraciones del establecimiento',
                'category' => 'establishment',
                'order' => 3,
            ],

            // Personal
            [
                'name' => 'staff.view',
                'label' => 'Ver Personal',
                'description' => 'Ver lista de empleados y sus datos',
                'category' => 'staff',
                'order' => 1,
            ],
            [
                'name' => 'staff.manage',
                'label' => 'Gestionar Personal',
                'description' => 'Contratar, editar y despedir personal',
                'category' => 'staff',
                'order' => 2,
            ],
            [
                'name' => 'staff.permissions',
                'label' => 'Asignar Permisos',
                'description' => 'Otorgar y revocar permisos a empleados',
                'category' => 'staff',
                'order' => 3,
            ],

            // Servicios
            [
                'name' => 'services.view',
                'label' => 'Ver Servicios',
                'description' => 'Ver catálogo de servicios',
                'category' => 'services',
                'order' => 1,
            ],
            [
                'name' => 'services.manage',
                'label' => 'Gestionar Servicios',
                'description' => 'Crear, editar y eliminar servicios',
                'category' => 'services',
                'order' => 2,
            ],
            [
                'name' => 'services.pricing',
                'label' => 'Modificar Precios',
                'description' => 'Cambiar precios de servicios',
                'category' => 'services',
                'order' => 3,
            ],

            // Citas
            [
                'name' => 'bookings.view',
                'label' => 'Ver Citas',
                'description' => 'Ver todas las citas',
                'category' => 'bookings',
                'order' => 1,
            ],
            [
                'name' => 'bookings.manage',
                'label' => 'Gestionar Citas',
                'description' => 'Crear, editar y cancelar citas',
                'category' => 'bookings',
                'order' => 2,
            ],
            [
                'name' => 'bookings.manage_own',
                'label' => 'Gestionar Citas Propias',
                'description' => 'Solo gestionar citas asignadas a uno mismo',
                'category' => 'bookings',
                'order' => 3,
            ],

            // Inventario
            [
                'name' => 'inventory.view',
                'label' => 'Ver Inventario',
                'description' => 'Ver productos e inventario',
                'category' => 'inventory',
                'order' => 1,
            ],
            [
                'name' => 'inventory.manage',
                'label' => 'Gestionar Inventario',
                'description' => 'Agregar, editar y eliminar productos',
                'category' => 'inventory',
                'order' => 2,
            ],

            // Finanzas
            [
                'name' => 'payments.view',
                'label' => 'Ver Pagos',
                'description' => 'Ver información de pagos y transacciones',
                'category' => 'payments',
                'order' => 1,
            ],
            [
                'name' => 'payments.manage',
                'label' => 'Gestionar Pagos',
                'description' => 'Procesar pagos y reembolsos',
                'category' => 'payments',
                'order' => 2,
            ],
            [
                'name' => 'commissions.view',
                'label' => 'Ver Comisiones',
                'description' => 'Ver comisiones del personal',
                'category' => 'payments',
                'order' => 3,
            ],
            [
                'name' => 'commissions.view_own',
                'label' => 'Ver Comisiones Propias',
                'description' => 'Ver solo las comisiones propias',
                'category' => 'payments',
                'order' => 4,
            ],

            // Reportes
            [
                'name' => 'reports.view',
                'label' => 'Ver Reportes',
                'description' => 'Ver reportes y estadísticas',
                'category' => 'reports',
                'order' => 1,
            ],
            [
                'name' => 'reports.export',
                'label' => 'Exportar Reportes',
                'description' => 'Exportar reportes a PDF/Excel',
                'category' => 'reports',
                'order' => 2,
            ],

            // Configuración
            [
                'name' => 'settings.view',
                'label' => 'Ver Configuración',
                'description' => 'Ver configuración del sistema',
                'category' => 'settings',
                'order' => 1,
            ],
            [
                'name' => 'settings.manage',
                'label' => 'Gestionar Configuración',
                'description' => 'Modificar configuración del sistema',
                'category' => 'settings',
                'order' => 2,
            ],

            // Horarios
            [
                'name' => 'schedule.view',
                'label' => 'Ver Horarios',
                'description' => 'Ver horarios del personal',
                'category' => 'schedule',
                'order' => 1,
            ],
            [
                'name' => 'schedule.manage',
                'label' => 'Gestionar Horarios',
                'description' => 'Modificar horarios del personal',
                'category' => 'schedule',
                'order' => 2,
            ],
            [
                'name' => 'schedule.manage_own',
                'label' => 'Gestionar Horario Propio',
                'description' => 'Modificar solo el horario propio',
                'category' => 'schedule',
                'order' => 3,
            ],

            // Clientes
            [
                'name' => 'customers.view',
                'label' => 'Ver Clientes',
                'description' => 'Ver base de datos de clientes',
                'category' => 'customers',
                'order' => 1,
            ],
            [
                'name' => 'customers.manage',
                'label' => 'Gestionar Clientes',
                'description' => 'Editar información de clientes',
                'category' => 'customers',
                'order' => 2,
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
