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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            
            // Calificación
            $table->tinyInteger('rating'); // 1-5
            $table->text('comment')->nullable();
            $table->json('photos')->nullable(); // Array de URLs de fotos del resultado
            
            // Estado
            $table->enum('status', ['pending', 'published', 'hidden', 'flagged'])->default('published');
            $table->boolean('is_verified')->default(false); // Si el cliente realmente asistió
            
            // Respuesta
            $table->text('response')->nullable();
            $table->foreignId('responded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('responded_at')->nullable();
            
            // Moderación
            $table->integer('reports_count')->default(0);
            $table->text('moderation_notes')->nullable();
            
            // Métricas
            $table->integer('helpful_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['establishment_id', 'status', 'rating']);
            $table->index(['professional_id', 'status', 'rating']);
            $table->index(['customer_id', 'created_at']);
            $table->unique(['appointment_id']); // Una reseña por cita
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
