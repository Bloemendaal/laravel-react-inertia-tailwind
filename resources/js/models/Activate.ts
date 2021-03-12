
export const CodeLength = 8;
export const AllowedCodeChars = /^[BCDFGHJKLMNPQRSTVWXZ]$/i;

export interface ActivateResponse {
    client_id: number;
    expires_at: string;
    id: string;
    info: string;
    last_polled_at: string;
    retry_interval: number;
    revoked: boolean;
    scopes: string[];
    user_code: string;
    user_id: number;
}
