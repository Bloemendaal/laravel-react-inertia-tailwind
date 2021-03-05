<?php

namespace App\Repositories;

use App\Models\DeviceCode;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Passport\Passport;
use Laravel\Passport\Token;

class DeviceCodeRepository
{
    public static $deviceCodeModel = 'App\Models\DeviceCode';

    /** @todo fix this temp fuction also unifi functions revoke ect. */
    public function activate($user_id, $user_code)
    {
        $deviceCode = (new static::$deviceCodeModel)->where('user_code', $user_code)->first();
        $deviceCode->user_id = $user_id;
        $deviceCode->save();

        return $deviceCode;
    }

    /** Creates a new device code. */
    public function create(array $attributes): DeviceCode
    {
        return (new static::$deviceCodeModel)->create($attributes);
    }

    /** Get a device code by the given ID. */
    public function find(string $id): DeviceCode
    {
        return (new static::$deviceCodeModel)->where('id', $id)->first();
    }

    /** Get a token by the given user ID and token ID. */
    public function findForUser(string $id, int $userId): ?Token
    {
        return $this->forUser($userId, $id)->first();
    }

    /**
     * Get the token instances for the given user ID.
     *
     * @param  mixed  $userId
     * @param  mixed  $id
     */
    public function forUser($userId, $id = null): Collection
    {
        $deviceTokens = Passport::token()
            ->whereUserId($userId)
            ->whereRevoked(false)
            ->whereHas('client', function ($query) {
                $query->whereDeviceClient(true);
            });

        $deviceRequests = (new static::$deviceCodeModel)
            ->whereUserId($userId)
            ->whereRevoked(false);

        if (!\is_null($id)) {
            $deviceTokens = $deviceTokens->whereId($id);
            $deviceRequests = $deviceRequests->whereId($id);
        }

        return $deviceTokens->get()->concat($deviceRequests->get());
    }

    /** Set the retry interval of this code. */
    public function setRetryInterval(string $id, int $seconds): DeviceCode
    {
        return (new static::$deviceCodeModel)->where('id', $id)->first()->setInterval($seconds);
    }

    /**
     * Revoke an device code.
     *
     * @return mixed
     */
    public function revokeDeviceCode(string $id)
    {
        return (new static::$deviceCodeModel)->where('id', $id)->update(['revoked' => true]);
    }

    /** Check if the device code has been revoked. */
    public function isDeviceCodeRevoked(string $id): bool
    {
        if ($deviceCode = $this->find($id)) {
            return $deviceCode->revoked;
        }

        return true;
    }
}
