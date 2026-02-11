export interface AuthTokenPayload{
    id: number;
    name: string;
    user_id?: string;
    iat: number;
    exp: number;
}