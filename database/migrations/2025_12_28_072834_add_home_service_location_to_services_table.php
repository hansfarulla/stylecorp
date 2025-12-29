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
        Schema::table('services', function (Blueprint $table) {
            $table->decimal('home_service_radius_km', 8, 2)->nullable()->after('home_service_surcharge');
            $table->decimal('home_service_latitude', 10, 8)->nullable()->after('home_service_radius_km');
            $table->decimal('home_service_longitude', 11, 8)->nullable()->after('home_service_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['home_service_radius_km', 'home_service_latitude', 'home_service_longitude']);
        });
    }
};
