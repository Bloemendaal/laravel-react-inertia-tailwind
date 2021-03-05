<?php

/**
 * @author      Alex Bilbie <hello@alexbilbie.com>
 * @copyright   Copyright (c) Alex Bilbie
 * @license     http://mit-license.org/
 *
 * @link        https://github.com/thephpleague/oauth2-server
 */

namespace App\Models\Traits;

use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

trait DeviceCodeTrait
{
    private string $userCode;

    private string $verificationUri;

    private int $retryInterval;

    private \DateTimeImmutable $lastPolledDateTime;

    public function getUserCode(): string
    {
        return $this->userCode;
    }

    /**
     * @param string $userCode
     *
     * @return string
     */
    public function setUserCode(string $userCode): self
    {
        $this->userCode = $userCode;

        return $this;
    }

    public function getVerificationUri(): string
    {
        return $this->verificationUri;
    }

    public function setVerificationUri(string $verificationUri): self
    {
        $this->verificationUri = $verificationUri;

        return $this;
    }

    public function getRetryInterval(): int
    {
        return $this->retryInterval;
    }

    public function setRetryInterval(int $retryInterval): self
    {
        $this->retryInterval = $retryInterval;

        return $this;
    }

    public function getLastPolledDateTime(): ?\DateTimeImmutable
    {
        return $this->lastPolledDateTime;
    }

    public function setLastPolledDateTime($lastPolledDateTime): self
    {
        $this->lastPolledDateTime = $lastPolledDateTime;

        return $this;
    }

    /**
     * @param DateTimeImmutable  $nowDateTime
     * @return int  Slow-down in seconds for the retry interval.
     */
    public function checkRetryFrequency(\DateTimeImmutable $nowDateTime): int
    {
        $retryInterval = $this->getRetryInterval();

        if ($lastPolleDateTime = $this->getLastPolledDateTime()) {
            // Seconds passed since last retry.
            $nowTimestamp = $nowDateTime->getTimestamp();
            $lastPollingTimestamp = $lastPolleDateTime->getTimestamp();

            if ($retryInterval > $nowTimestamp - $lastPollingTimestamp) {
                return $retryInterval; // polling to fast.
            }
        }

        return $slowDownSeconds = 0;
    }

    abstract public function getClient(): ClientEntityInterface;

    abstract public function getExpiryDateTime(): \DateTimeImmutable;

    /**
     * @return ScopeEntityInterface[]
     */
    abstract public function getScopes(): array;

    abstract public function getIdentifier(): string;
}
