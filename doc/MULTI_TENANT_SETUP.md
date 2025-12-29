# Sistema Multi-Tenant - StyleCore

## Configuración Implementada

StyleCore usa **stancl/tenancy** con enfoque **single-database** (una sola BD con `tenant_id`).

## Uso Básico

### Crear un Tenant

```bash
php artisan tenant:create "Nombre Barbería" email@example.com
```

### Aplicar Multi-Tenancy a Modelos

```php
use App\Traits\BelongsToTenant;

class Establecimiento extends Model
{
    use BelongsToTenant;
    
    protected $fillable = ['tenant_id', 'nombre', ...];
}
```

El trait automáticamente:
- Asigna `tenant_id` al crear registros
- Filtra queries por el tenant actual
- Previene acceso cross-tenant

### Acceso por URL

Los tenants se identifican por path:
- `/tenant/{tenant-id}/dashboard`
- `/tenant/{tenant-id}/reservas`

### Modelo Tenant

```php
use App\Models\Tenant;

$tenant = Tenant::create([
    'id' => 'mi-barberia',
    'name' => 'Mi Barbería',
    'email' => 'contacto@mibarberia.com',
    'subscription_plan' => 'trial',
]);
```

## Estructura de Tablas

Todas las tablas multi-tenant deben tener:
```php
$table->string('tenant_id')->nullable()->index();
$table->unique(['tenant_id', 'otro_campo_unique']);
```

## Comandos Útiles

```bash
# Crear tenant
php artisan tenant:create "Nombre" email

# Listar tenants
php artisan tinker
>>> Tenant::all()

# Ver migraciones
php artisan migrate:status
```
