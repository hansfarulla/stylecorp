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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Tipo de notificación
            $table->string('type'); // appointment_reminder, appointment_confirmed, promotion, etc.
            $table->string('channel'); // push, email, sms, whatsapp
            
            // Contenido
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Datos adicionales (IDs, URLs, etc.)
            $table->string('action_url')->nullable();
            
            // Estado
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            
            // Respuesta del canal
            $table->string('external_id')->nullable(); // ID del proveedor (SendGrid, Twilio, etc.)
            $table->string('delivery_status')->nullable(); // delivered, bounced, failed
            
            $table->timestamps();
            
            // Índices
            $table->index(['user_id', 'is_read', 'created_at']);
            $table->index(['type', 'is_sent']);
            $table->index('scheduled_for');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
