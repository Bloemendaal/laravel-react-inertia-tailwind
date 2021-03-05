<?php

/**
 * @author      Alex Bilbie <hello@alexbilbie.com>
 * @copyright   Copyright (c) Alex Bilbie
 * @license     http://mit-license.org/
 *
 * @link        https://github.com/thephpleague/oauth2-server
 */

namespace App\Repositories\Bridges;

use App\Models\Bridges\DeviceCodeInterface;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Exception\UniqueTokenIdentifierConstraintViolationException;
use League\OAuth2\Server\Repositories\RepositoryInterface;

interface DeviceCodeRepositoryInterface extends RepositoryInterface
{
    /** Creates a new DeviceCode */
    public function getNewDeviceCode(): DeviceCodeInterface;

    /**
     * Persists a new auth code to permanent storage.
     *
     * @throws UniqueTokenIdentifierConstraintViolationException
     */
    public function persistNewDeviceCode(DeviceCodeInterface $deviceCodeEntity);

    /** Get a device code entity. */
    public function getDeviceCodeByIdentifier(string $deviceCodeId, string $grantType, ClientEntityInterface $clientEntity): ?DeviceCodeInterface;

    /** Revoke a device code. */
    public function revokeDeviceCode(string $deviceCodeId);

    /**
     * Check if the device code has been revoked.
     *
     * @return bool Return true if this code has been revoked
     */
    public function isDeviceCodeRevoked(string $deviceCodeId): bool;
}
