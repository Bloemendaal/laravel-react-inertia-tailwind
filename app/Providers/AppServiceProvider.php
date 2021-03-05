<?php

namespace App\Providers;

use App\Auth\Grants\DeviceCodeGrant;
use App\Repositories\Bridges\DeviceCodeRepository;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Bridge\RefreshTokenRepository;
use Laravel\Passport\Passport;
use League\OAuth2\Server\AuthorizationServer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        app(AuthorizationServer::class)
            ->enableGrantType(new DeviceCodeGrant(
                $this->app->make(DeviceCodeRepository::class),
                $this->app->make(RefreshTokenRepository::class),
                new \DateInterval('PT10M')
            ), Passport::tokensExpireIn());
    }
}
