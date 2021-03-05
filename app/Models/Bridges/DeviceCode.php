<?php

namespace App\Models\Bridges;

use App\Models\Traits\DeviceCodeTrait;
use App\Repositories\DeviceCodeRepository;
use League\OAuth2\Server\Entities\Traits\EntityTrait;
use League\OAuth2\Server\Entities\Traits\TokenEntityTrait;

abstract class DeviceCode implements DeviceCodeInterface
{
    use EntityTrait, TokenEntityTrait, DeviceCodeTrait {
        checkRetryFrequency as parentCheckRetryFrequency;
    }

    public function __construct(DeviceCodeRepository $deviceCodeRepository)
    {
        $this->deviceCodeRepository = $deviceCodeRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function setUserCode(string $userCode): self
    {
        if (!preg_match("/\w+-\w+/", $userCode)) {
            $userCode = substr_replace($userCode, '-', 4, 0);
        }

        $this->userCode = $userCode;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function checkRetryFrequency(\DateTimeImmutable $nowDateTime): int
    {
        $slowDownSeconds = $this->parentCheckRetryFrequency($nowDateTime);

        if ($slowDownSeconds) {
            $slowDownSeconds = ceil($slowDownSeconds * 2.0);
            $this->deviceCodeRepository->setRetryInterval(
                $this->getIdentifier(),
                $slowDownSeconds
            );
        }

        return $slowDownSeconds;
    }
}
