<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comercios_categorias', function (Blueprint $table) {
            $table->id();

            $table->foreignId('comercios_id')->constrained('comercios');
            $table->foreignId('categorias_id')->constrained('categorias');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comercios_categorias');
    }
};
