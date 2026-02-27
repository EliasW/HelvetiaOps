import NextAuth, { NextAuthOptions } from 'next-auth';
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

const options: NextAuthOptions = {
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
          const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
          return { id: email, email, role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // store role on token
        token.role = user.role as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
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

const handler = NextAuth(options);
export { handler as GET, handler as POST };
