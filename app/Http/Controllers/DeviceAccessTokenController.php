<?php

namespace App\Http\Controllers;

use App\Repositories\DeviceCodeRepository;
use App\Models\DeviceCode;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Passport\PersonalAccessTokenResult;
use Laravel\Passport\TokenRepository;

class DeviceAccessTokenController
{
    /** The token repository implementation. */
    protected TokenRepository $tokenRepository;

    /** The validation factory implementation. */
    protected ValidationFactory $validation;

    public function __construct(
        DeviceCodeRepository $deviceCodeRepository,
        ValidationFactory $validation
    ) {
        $this->validation = $validation;
        $this->deviceCodeRepository = $deviceCodeRepository;
    }

    /** Check device request exist. */
    public function request(Request $request): Collection
    {
        $deviceCode = DeviceCode::where('user_code', $request->user_code)
            ->where('expires_at', '>', now())
            ->first();

        return $deviceCode ?? response()->json([
            'message' => __('User code has expired or is invalid. Please try again.')
        ], 404);
    }

    /** Get all of the personal access tokens for the authenticated user. */
    public function forUser(Request $request): Collection
    {
        return $this->deviceCodeRepository
            ->forUser($request->user()->getKey())
            ->sortBy('expires_at')
            ->values();
    }

    /**
     * Activate new device for the user.
     * @todo fix this response myst be created..
     */
    public function store(Request $request): PersonalAccessTokenResult
    {
        $validate = [
            'user_code' => [
                'required',
                'exists:' . with(new DeviceCode)->getTable() . ',user_code'
            ],
        ];

        $errors = [
            'user_code.exists' => 'This code does not exist. Please try again.',
        ];

        $this->validation->make($request->all(), $validate, $errors)->validate();

        return $request->user()->activateDevice($request->user_code);
    }

    /** Delete the given token. */
    public function destroy(Request $request, string $tokenId): Response
    {
        $token = $this->deviceCodeRepository->findForUser(
            $tokenId,
            $request->user()->getKey()
        );

        if (\is_null($token)) {
            return new Response('', 404);
        }

        $token->revoke();

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
