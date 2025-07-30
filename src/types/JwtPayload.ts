import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
  role?: Role;
}
