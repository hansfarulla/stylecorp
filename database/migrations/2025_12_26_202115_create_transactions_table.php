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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Identificación
            $table->string('transaction_code')->unique();
            $table->enum('type', ['payment', 'refund', 'commission', 'tip', 'product_sale'])->default('payment');
            
            // Montos
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tip', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency', 3)->default('CRC');
            
            // Método de pago
            $table->enum('payment_method', ['cash', 'card', 'sinpe', 'transfer', 'apple_pay', 'google_pay', 'loyalty_points', 'mixed'])->nullable();
            $table->json('mixed_payments')->nullable(); // [{method: 'cash', amount: 5000}, {method: 'sinpe', amount: 10000}]
            
            // Datos de pago electrónico
            $table->string('payment_gateway')->nullable(); // stripe, bac, etc
            $table->string('gateway_transaction_id')->nullable();
            $table->string('gateway_response')->nullable();
            
            // Estado
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->string('refund_reason')->nullable();
            
            // Comisiones
            $table->decimal('professional_commission', 10, 2)->default(0);
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('establishment_net', 10, 2)->default(0);
            
            // Facturación
            $table->string('invoice_number')->nullable();
            $table->string('invoice_url')->nullable();
            
            // Auditoría
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['establishment_id', 'status']);
            $table->index(['professional_id', 'type']);
            $table->index(['tenant_id', 'paid_at']);
            $table->index('transaction_code');
            $table->index(['customer_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
