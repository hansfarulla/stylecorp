# Sistema de Permisos Granulares

## 🎯 Descripción

El sistema de permisos granulares permite a los **Owners** asignar permisos específicos e individuales a empleados (Managers, Staff, Freelancers), más allá de los permisos predefinidos de sus roles.

## 📊 Jerarquía de Permisos

```
1. Super Admin → Acceso total (*) 
2. Owner → Acceso total al establecimiento + Asignar permisos
3. Role Permissions → Permisos base del rol (UserRole enum)
4. Custom Permissions → Permisos granulares asignados individualmente
```

## 🔑 Cómo Funcionan los Permisos

### Verificación en Cascada

Cuando se verifica un permiso con `$user->hasPermission('services.manage')`, el sistema verifica en orden:

1. **¿Es Super Admin?** → ✅ Acceso concedido
2. **¿Es Owner del establecimiento?** → ✅ Acceso concedido
3. **¿Está en los permisos del rol?** → ✅ Acceso concedido (según UserRole enum)
4. **¿Tiene permiso granular asignado?** → ✅/❌ Según configuración personalizada

### Ejemplo Práctico

**Caso:** Juan es Manager, pero el Owner quiere que también pueda ver pagos.

```php
// Permisos base de Manager (UserRole.php)
[
    'staff.view',
    'services.manage',
    'bookings.manage',
    'inventory.manage',
    'reports.view',
]
// ❌ NO incluye 'payments.view'

// Owner asigna permiso granular:
$juan->grantPermission('payments.view', $establishmentId, $ownerId);

// Ahora Juan tiene acceso:
$juan->hasPermission('payments.view'); // ✅ true
```

## 🗃️ Estructura de Base de Datos

### Tabla: `permissions`

Catálogo global de permisos disponibles en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint | ID único |
| `tenant_id` | string | Tenant (multi-tenancy) |
| `name` | string | Identificador (ej: `staff.manage`) |
| `label` | string | Nombre legible (ej: "Gestionar Personal") |
| `description` | text | Descripción detallada |
| `category` | string | Categoría (staff, bookings, etc.) |
| `order` | int | Orden de visualización |

### Tabla: `permission_user`

Permisos asignados a usuarios específicos (pivot table).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user_id` | bigint | Usuario que recibe el permiso |
| `permission_id` | bigint | Permiso asignado |
| `establishment_id` | bigint | Establecimiento (scope) |
| `granted` | boolean | true = concedido, false = revocado |
| `granted_by` | bigint | Owner que otorgó el permiso |

## 📝 Permisos Disponibles

### Establecimiento
- `establishment.view` - Ver información del establecimiento
- `establishment.manage` - Gestionar establecimiento
- `establishment.settings` - Configurar establecimiento

### Personal
- `staff.view` - Ver personal
- `staff.manage` - Gestionar personal (contratar/despedir)
- `staff.permissions` - Asignar permisos

### Servicios
- `services.view` - Ver servicios
- `services.manage` - Gestionar servicios
- `services.pricing` - Modificar precios

### Citas
- `bookings.view` - Ver todas las citas
- `bookings.manage` - Gestionar citas
- `bookings.manage_own` - Solo citas propias

### Inventario
- `inventory.view` - Ver inventario
- `inventory.manage` - Gestionar inventario

### Finanzas
- `payments.view` - Ver pagos
- `payments.manage` - Gestionar pagos
- `commissions.view` - Ver comisiones
- `commissions.view_own` - Solo comisiones propias

### Reportes
- `reports.view` - Ver reportes
- `reports.export` - Exportar reportes

### Configuración
- `settings.view` - Ver configuración
- `settings.manage` - Gestionar configuración

### Horarios
- `schedule.view` - Ver horarios
- `schedule.manage` - Gestionar horarios
- `schedule.manage_own` - Solo horario propio

### Clientes
- `customers.view` - Ver clientes
- `customers.manage` - Gestionar clientes

## 💻 Uso en Código

### Verificar Permiso

```php
// En controlador
if (!$request->user()->hasPermission('staff.manage', $establishmentId)) {
    abort(403, 'No autorizado');
}

// Con middleware
Route::get('/staff', [StaffController::class, 'index'])
    ->middleware('permission:staff.view');

// Verificar múltiples permisos
if ($user->hasAnyPermission(['staff.view', 'staff.manage'], $establishmentId)) {
    // Tiene al menos uno
}

if ($user->hasAllPermissions(['staff.view', 'staff.manage'], $establishmentId)) {
    // Tiene todos
}
```

### Asignar/Revocar Permisos

```php
// Asignar permiso
$user->grantPermission('payments.view', $establishmentId, $ownerId);

// Revocar permiso
$user->revokePermission('payments.view', $establishmentId);

// Obtener todos los permisos efectivos
$allPermissions = $user->getAllPermissions($establishmentId);
// ['staff.view', 'services.manage', ..., 'payments.view']
```

### En Blade/Inertia

```php
// Pasar permisos a la vista
return Inertia::render('Page', [
    'can' => [
        'manageStaff' => $user->hasPermission('staff.manage', $establishmentId),
        'viewPayments' => $user->hasPermission('payments.view', $establishmentId),
    ]
]);
```

```tsx
// En React
{can.manageStaff && (
    <Button>Gestionar Personal</Button>
)}
```

## 🖥️ Interfaz de Usuario

### Acceso

**Ruta:** `/business/staff/{id}/permissions`

**Restricción:** Solo Owners

### Flujo de Uso

1. Owner va a la lista de personal
2. Clic en "Permisos" para un empleado
3. Ve los permisos del rol (marcados en azul, no editables)
4. Selecciona permisos adicionales que desea otorgar
5. Guarda cambios

### Características

- ✅ Permisos organizados por categoría
- ✅ Iconos visuales para cada categoría
- ✅ Indicador de permisos incluidos en el rol
- ✅ Descripciones detalladas de cada permiso
- ✅ Diseño mobile-first responsive
- ✅ Sticky footer con botones de acción

## 🚀 Instalación

### 1. Ejecutar Migraciones

```bash
php artisan migrate
```

### 2. Ejecutar Seeders

```bash
php artisan db:seed --class=PermissionSeeder
```

### 3. (Opcional) Limpiar permisos anteriores

Si ya tienes usuarios y quieres resetear:

```bash
php artisan migrate:fresh --seed
```

## 🔒 Seguridad

### Restricciones

1. **Solo Owners pueden asignar permisos**
   - Los Managers NO pueden asignar permisos a otros

2. **No se pueden modificar permisos de:**
   - Super Admins
   - Owners
   
3. **Scope por establecimiento**
   - Los permisos son específicos por establecimiento
   - Un usuario puede tener diferentes permisos en diferentes establecimientos

4. **Auditoría**
   - Se registra quién otorgó cada permiso (`granted_by`)
   - Timestamps de cuándo se otorgó/revocó

## 📊 Ejemplos de Casos de Uso

### Caso 1: Manager con Acceso a Finanzas

```php
// María es Manager, pero necesita ver pagos
$maria->grantPermission('payments.view', $salonId, $ownerId);
$maria->grantPermission('reports.export', $salonId, $ownerId);
```

### Caso 2: Staff con Gestión de Inventario

```php
// Pedro es Staff, pero maneja el inventario
$pedro->grantPermission('inventory.manage', $salonId, $ownerId);
```

### Caso 3: Freelancer con Vista de Reportes

```php
// Ana es Freelancer, pero quiere ver estadísticas
$ana->grantPermission('reports.view', $salonId, $ownerId);
```

## 🛠️ Mantenimiento

### Agregar Nuevo Permiso

1. Editar `database/seeders/PermissionSeeder.php`
2. Agregar el nuevo permiso al array
3. Ejecutar: `php artisan db:seed --class=PermissionSeeder`

### Modificar Permisos de Rol

Editar `app/Enums/UserRole.php`:

```php
self::MANAGER => [
    'staff.view',
    'services.manage',
    // ... agregar nuevos permisos
],
```

## ⚠️ Importante

- Los permisos granulares **complementan** los permisos del rol, no los reemplazan
- Un Owner siempre tiene todos los permisos de su establecimiento
- Los permisos son por establecimiento (un usuario puede tener distintos permisos en diferentes establecimientos)
- Siempre verificar permisos tanto en backend (controladores/middleware) como en frontend (UI condicional)

## 📚 Referencias

- Modelo: `app/Models/Permission.php`
- Relación Usuario: `app/Models/User.php` (métodos `hasPermission`, `grantPermission`, etc.)
- Controlador: `app/Http/Controllers/Business/StaffPermissionsController.php`
- Vista: `resources/js/pages/business/staff/permissions.tsx`
- Middleware: `app/Http/Middleware/CheckPermission.php`
- Seeder: `database/seeders/PermissionSeeder.php`
