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
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sedes_id')->constrained('sedes');
            $table->foreignId('subcategorias_id')->constrained('subcategorias');
            $table->string('servicio');
            $table->string('url')->nullable();
            $table->string('whatsapp')->nullable();
            $table->text('descripcion');
            $table->string('imagen');
            $table->string('precio');
            $table->boolean('es_virtual')->default(false);
            $table->boolean('a_domicilio')->default(false);
            $table->boolean('en_sede')->default(false);
            $table->integer('precio_domicilio');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
