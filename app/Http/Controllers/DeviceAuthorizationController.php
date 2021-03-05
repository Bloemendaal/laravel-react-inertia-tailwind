<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Laravel\Passport\Http\Controllers\HandlesOAuthErrors;
use League\OAuth2\Server\AuthorizationServer;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response as Psr7Response;

class DeviceAuthorizationController
{
    use HandlesOAuthErrors;

    /** The authorization server. */
    protected AuthorizationServer $server;

    /** Create a new controller instance. */
    public function __construct(AuthorizationServer $server)
    {
        $this->server = $server;
    }

    /** Authorize a client to access the user's account. */
    public function authorize(ServerRequestInterface $psrRequest): Response
    {
        $deviceAuthRequest = $this->withErrorHandling(function () use ($psrRequest) {
            return $this->server->validateDeviceAuthorizationRequest($psrRequest);
        });

        return $this->convertResponse(
            $this->server->completeDeviceAuthorizationRequest(
                $deviceAuthRequest,
                new Psr7Response
            )
        );
    }
}
