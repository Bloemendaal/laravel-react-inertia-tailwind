<?php

/**
 * @author      Alex Bilbie <hello@alexbilbie.com>
 * @copyright   Copyright (c) Alex Bilbie
 * @license     http://mit-license.org/
 *
 * @link        https://github.com/thephpleague/oauth2-server
 */

namespace App\Http\Requests;

use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

class DeviceAuthorizationRequest
{
    /** The grant type identifier */
    protected string $grantTypeId;

    /** The client identifier */
    protected ClientEntityInterface $client;

    /**
     * An array of scope identifiers
     *
     * @var ScopeEntityInterface[]
     */
    protected array $scopes = [];

    public function getGrantTypeId(): string
    {
        return $this->grantTypeId;
    }

    public function setGrantTypeId($grantTypeId): self
    {
        $this->grantTypeId = $grantTypeId;

        return $this;
    }

    public function getClient(): ClientEntityInterface
    {
        return $this->client;
    }

    public function setClient(ClientEntityInterface $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return ScopeEntityInterface[]
     */
    public function getScopes(): array
    {
        return $this->scopes;
    }

    /**
     * @param ScopeEntityInterface[] $scopes
     */
    public function setScopes(array $scopes): self
    {
        $this->scopes = $scopes;

        return $this;
    }
}
