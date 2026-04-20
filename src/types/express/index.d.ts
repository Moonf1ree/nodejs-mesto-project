declare global {
  namespace Express {
    interface UserPayload {
      _id: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user: UserPayload;
    }
  }
}

export {};
