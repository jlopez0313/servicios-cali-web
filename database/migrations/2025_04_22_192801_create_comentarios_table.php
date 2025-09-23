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
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sedes_id')->nullable()->constrained('sedes');
            $table->foreignId('servicios_id')->nullable()->constrained('servicios');
            $table->foreignId('clientes_id')->nullable()->constrained('users');

            $table->text('comentario')->nullable();
            $table->tinyInteger('rating');
            $table->boolean('aprobado');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
