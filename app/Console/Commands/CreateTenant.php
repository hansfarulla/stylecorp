<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;

class CreateTenant extends Command
{
    protected $signature = 'tenant:create {name} {email?}';
    protected $description = 'Crear un nuevo tenant en el sistema';

    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email') ?? $name . '@example.com';

        $tenant = Tenant::create([
            'id' => \Str::slug($name),
            'name' => $name,
            'email' => $email,
        ]);

        $tenant->domains()->create([
            'domain' => \Str::slug($name) . '.localhost',
        ]);

        $this->info("✓ Tenant creado exitosamente");
        $this->info("  ID: {$tenant->id}");
        $this->info("  Nombre: {$tenant->name}");
        $this->info("  Email: {$tenant->email}");
        $this->info("  Dominio: " . $tenant->domains->first()->domain);
        $this->info("  URL de acceso: /tenant/{$tenant->id}");

        return Command::SUCCESS;
    }
}
