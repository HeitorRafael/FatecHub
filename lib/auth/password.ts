import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    const hash = await bcryptjs.hash(password, SALT_ROUNDS);
    return hash;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcryptjs.compare(password, hash);
    return isMatch;
}
