import { SignJWT, JWTPayload, jwtVerify } from "jose";

interface Payload extends JWTPayload {
    email: string;
    id: number;
}

export async function CreateToken(email: string, id:number): Promise<string> {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const payload: Payload = { email, id };

    const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER as string)
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME as string)
    .sign(secret);

    return token;
}

export async function VerifyToken(token: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const decoded = await jwtVerify(token, secret);
    return decoded.payload;
}