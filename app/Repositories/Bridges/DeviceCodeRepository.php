<?php

namespace App\Repositories\Bridges;

use App\Models\Bridges\DeviceCode;
use App\Models\Bridges\DeviceCodeInterface;
use App\Repositories\DeviceCodeRepository as PassportDeviceCodeRepository;
use Laravel\Passport\TokenRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Laravel\Passport\Bridge\FormatsScopesForStorage;
use Laravel\Passport\Bridge\Scope;
use Laravel\Passport\Events\AccessTokenCreated;
use League\OAuth2\Server\Entities\ClientEntityInterface;

class DeviceCodeRepository implements DeviceCodeRepositoryInterface
{
    use FormatsScopesForStorage;

    /** The device passport repository instance. */
    protected PassportDeviceCodeRepository $deviceCodeRepository;

    /** The token repository instance. */
    protected TokenRepository $tokenRepository;

    /** The event dispatcher instance. */
    protected Dispatcher $events;

    public function __construct(
        PassportDeviceCodeRepository $deviceCodeRepository,
        TokenRepository $tokenRepository,
        Dispatcher $events
    ) {
        $this->events = $events;
        $this->tokenRepository = $tokenRepository;
        $this->deviceCodeRepository = $deviceCodeRepository;
    }

    /** {@inheritdoc} */
    public function getNewDeviceCode(): DeviceCodeInterface
    {
        return new DeviceCode($this->deviceCodeRepository);
    }

    /** {@inheritdoc} */
    public function persistNewDeviceCode(DeviceCodeInterface $deviceCodeEntity)
    {
        $this->deviceCodeRepository->create([
            'id' => $deviceCodeEntity->getIdentifier(),
            'user_code' => $deviceCodeEntity->getUserCode(),
            'user_id' => null,
            'client_id' => $deviceCodeEntity->getClient()->getIdentifier(),
            'scopes' => $this->scopesToArray($deviceCodeEntity->getScopes()),
            'revoked' => false,
            /** @todo give geo location using someting like ipinfo.io */
            'info' => request()->ip(),
            'retry_interval' => $deviceCodeEntity->getRetryInterval(),
            'last_polled_at' => $deviceCodeEntity->getLastPolledDateTime(),
            'expires_at' => $deviceCodeEntity->getExpiryDateTime(),
        ]);
    }

    /** {@inheritdoc} */
    public function getDeviceCodeByIdentifier(string $deviceCodeId, string $grantType, ClientEntityInterface $clientEntity): ?DeviceCodeInterface
    {
        $deviceCode = $this->deviceCodeRepository->find($deviceCodeId);

        $deviceCodeEntity = $this->getNewDeviceCode();
        $deviceCodeEntity->setIdentifier($deviceCode->id);
        $deviceCodeEntity->setUserCode($deviceCode->user_code);
        $deviceCodeEntity->setUserIdentifier($deviceCode->user_id);
        $deviceCodeEntity->setRetryInterval($deviceCode->retry_interval);
        $deviceCodeEntity->setLastPolledDateTime($deviceCode->last_polled_at);

        foreach ($deviceCode->scopes as $scope) {
            $deviceCodeEntity->addScope(new Scope($scope));
        }

        $deviceCodeEntity->setClient($clientEntity);

        $deviceCode->touch();

        $this->events->listen(AccessTokenCreated::class, function ($event) use ($deviceCodeEntity) {
            if ($event->clientId === $deviceCodeEntity->getClient()->getIdentifier()) {
                // Exchange request for token
                $token = $this->tokenRepository->find($event->tokenId);
                $token->name = $deviceCodeEntity->getUserCode();
                $token->save();

                $this->revokeDeviceCode($deviceCodeEntity->getIdentifier());
            }
        });

        return $deviceCodeEntity;
    }

    /** {@inheritdoc} */
    public function revokeDeviceCode(string $deviceCodeId)
    {
        $this->deviceCodeRepository->revokeDeviceCode($deviceCodeId);
    }

    /** {@inheritdoc} */
    public function isDeviceCodeRevoked(string $deviceCodeId): bool
    {
        return $this->deviceCodeRepository->isDeviceCodeRevoked($deviceCodeId);
    }
}
