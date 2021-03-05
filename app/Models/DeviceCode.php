<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Passport\Passport;

class DeviceCode extends Model
{
    /**
     * The database table used by the model.
     */
    protected $table = 'oauth_device_codes';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The guarded attributes on the model.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'scopes' => 'array',
        'revoked' => 'bool',
    ];

    /**
     * The attributes that should be mutated to dates.
     */
    protected $dates = [
        'last_polled_at',
        'expires_at',
    ];

    /**
     * The name of the "created at" column.
     *
     * @var string
     */
    const CREATED_AT = null;

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'last_polled_at';

    /**
     * The "type" of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * Get the client that owns the authentication code.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Passport::clientModel());
    }

    /**
     * Update the retry interval for this device.
     */
    public function setInterval(int $seconds): bool
    {
        $this->retry_interval = $seconds;

        return $this->save();
    }

    /**
     * Revoke the instance.
     */
    public function revoke(): bool
    {
        return $this->forceFill(['revoked' => true])->save();
    }
}
