

export interface JwtPayload {
    id: string;
    email: string;
    rol: string;
    iat?: number;
    exp?: number;
}