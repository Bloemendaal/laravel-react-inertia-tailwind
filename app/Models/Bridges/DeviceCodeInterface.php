<?php

/**
 * @author      Alex Bilbie <hello@alexbilbie.com>
 * @copyright   Copyright (c) Alex Bilbie
 * @license     http://mit-license.org/
 *
 * @link        https://github.com/thephpleague/oauth2-server
 */

namespace App\Models\Bridges;

use League\OAuth2\Server\Entities\TokenInterface;

interface DeviceCodeInterface extends TokenInterface
{
    public function getUserCode(): string;

    public function setUserCode(string $userCode): self;

    public function getVerificationUri(): string;

    public function setVerificationUri(string $verificationUri): self;

    public function getRetryInterval(): int;

    public function setRetryInterval(int $retryInterval): self;

    public function getLastPolledDateTime(): \DateTimeImmutable;

    public function setLastPolledDateTime(\DateTimeImmutable $lastPolledDateTime): self;

    /**
     * @param DateTimeImmutable  $nowDateTime
     * @return int  Slow-down in seconds for the retry interval.
     */
    public function checkRetryFrequency(\DateTimeImmutable $nowDateTime): int;
}
