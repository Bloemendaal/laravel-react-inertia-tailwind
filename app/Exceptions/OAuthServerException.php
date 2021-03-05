<?php

namespace App\Exceptions;

use League\OAuth2\Server\Exception\OAuthServerException as LeagueException;

class OAuthServerException extends LeagueException
{
    /** Expired token error when it took too long for the resource owner to authorize the client. */
    public static function expiredToken(?string $hint = null, ?\Throwable $previous = null): static
    {
        $errorMessage = 'The `device_code` has expired and the device authorization session has concluded.';

        return new static($errorMessage, 11, 'expired_token', 400, $hint, null, $previous);
    }

    /** Authorization pending when the resource owner did not authorize the client yet. */
    public static function authorizationPending(?string $hint = null): static
    {
        return new static(
            'The authorization request is still pending as the end user hasn\'t yet completed the user interaction steps. '
                . 'The client SHOULD repeat the Access Token Request to the token endpoint',
            12,
            'authorization_pending',
            400,
            $hint
        );
    }

    /** Slow down error when the client is pulling too frequently. */
    public static function slowDown(int $slowDown = 5, ?string $hint = null, ?\Throwable $previous = null): static
    {
        $serverException = new static(
            'The the authorization request is still pending and polling should continue, '
                . 'but the interval MUST be increased by ' . $slowDown
                . ' seconds for this and all subsequent requests.',
            12,
            'slow_down',
            400,
            $hint,
            null,
            $previous
        );

        $serverException->payload['slow_down'] = $slowDown;

        return $serverException;
    }
}
