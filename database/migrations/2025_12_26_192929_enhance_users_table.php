<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Información básica
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
            $table->string('avatar')->nullable()->after('phone_verified_at');
            
            // Rol y tipo de usuario
            $table->enum('role', ['super_admin', 'owner', 'manager', 'staff', 'freelancer', 'customer', 'guest'])->default('customer')->after('avatar');
            $table->enum('type', ['platform', 'establishment', 'professional', 'client'])->default('client')->after('role');
            
            // Perfil profesional
            $table->text('bio')->nullable()->after('type');
            $table->integer('years_experience')->nullable()->after('bio');
            $table->json('specialties')->nullable()->after('years_experience');
            $table->json('certifications')->nullable()->after('specialties');
            $table->boolean('is_verified')->default(false)->after('certifications');
            
            // OAuth
            $table->string('google_id')->nullable()->after('is_verified');
            $table->string('facebook_id')->nullable()->after('google_id');
            
            // Configuración
            $table->string('locale')->default('es')->after('facebook_id');
            $table->string('timezone')->default('America/Costa_Rica')->after('locale');
            $table->boolean('notifications_enabled')->default(true)->after('timezone');
            
            // Estado
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])->default('active')->after('notifications_enabled');
            $table->timestamp('last_login_at')->nullable()->after('status');
            
            // Índices adicionales
            $table->index(['tenant_id', 'role']);
            $table->index(['tenant_id', 'status']);
            $table->index('username');
            $table->index('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'role']);
            $table->dropIndex(['tenant_id', 'status']);
            $table->dropIndex(['username']);
            $table->dropIndex(['phone']);
            
            $table->dropColumn([
                'username', 'phone', 'phone_verified_at', 'avatar',
                'role', 'type', 'bio', 'years_experience', 
                'specialties', 'certifications', 'is_verified',
                'google_id', 'facebook_id', 'locale', 'timezone',
                'notifications_enabled', 'status', 'last_login_at'
            ]);
        });
    }
};
