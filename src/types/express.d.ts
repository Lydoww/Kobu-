declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      username: string;
      iat: number;
      exp: number;
      role?: string;
    };
  }
}

export {};
