import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// extend next-auth types so our `role` field is known
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: User;
  }
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        // very simple mock validation, accepts any nonempty password
        if (email && password) {
          const norm = email.toLowerCase();
          let role: string = 'viewer';
          if (norm.includes('admin')) {
            role = 'admin';
          } else if (norm.includes('manager') || norm.includes('man.')) {
            role = 'manager';
          }
          return { id: email, email, role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, role: user.role };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token as any).role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
};

// convenience exports for client code
export { signIn, signOut } from 'next-auth/react';

