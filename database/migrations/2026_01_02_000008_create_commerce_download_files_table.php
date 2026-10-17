<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_download_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('commerce_products')->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('commerce_variants')->nullOnDelete();
            $table->string('uid', 32)->nullable();
            $table->string('type', 10)->default('file');
            $table->string('name');
            $table->string('disk', 40)->nullable();
            $table->string('path')->nullable();
            $table->string('filename')->nullable();
            $table->string('mime_type', 120)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->text('url')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->boolean('attached')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_download_files');
    }
};
