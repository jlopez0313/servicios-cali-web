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
        Schema::create('sedes_categorias', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sedes_id')->constrained('sedes');
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
        Schema::dropIfExists('sedes_categorias');
    }
};
