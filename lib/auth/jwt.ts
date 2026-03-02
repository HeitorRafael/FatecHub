import jwt from 'jsonwebtoken';

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'ADMIN' | 'ESTUDANTE' | 'EMPRESA';
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-jwt-super-secreta-aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.decode(token) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
