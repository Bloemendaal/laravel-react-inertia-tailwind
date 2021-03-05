<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOauthDeviceCodesTable extends Migration
{
    /** Run the migrations. */
    public function up(): void
    {
        Schema::create('oauth_device_codes', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('user_code', 9);
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->unsignedBigInteger('client_id');
            $table->text('info');
            $table->text('scopes')->nullable();
            $table->boolean('revoked');
            $table->integer('retry_interval')->default(5);
            $table->dateTime('last_polled_at')->nullable();
            $table->dateTime('expires_at')->nullable();
        });
    }

    /** Reverse the migrations. */
    public function down(): void
    {
        Schema::dropIfExists('oauth_device_codes');
    }
}
