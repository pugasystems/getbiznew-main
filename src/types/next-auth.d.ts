import type { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface UserData {
  vendors: { id: number; name: string }[];
  userId: number;
  role: {
    id: number;
    name: string;
  };
  hasVerified: boolean;
  accessToken: string;
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserData;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData;
  }

  interface User extends UserData {}
}
