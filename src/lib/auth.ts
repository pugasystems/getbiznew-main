import { type NextAuthOptions } from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';

import { API_BASE_URL } from '@/utils/constants';

const authOptions: NextAuthOptions = {
  callbacks: {
    /* async signIn({ account, user, profile }) {
      if (account.provider === 'google') {
        try {
          const response = await axios.post('auth/google/', {
            auth_token: account.id_token,
          });
          user.idx = response.data.idx;
          user.avatar = response.data.avatar || profile.picture;
          user.email = response.data.email;
          user.first_name = response.data.first_name;
          user.last_name = response.data.last_name;
          user.phone = response.data.phone;
          user.is_active = response.data.is_active;
          user.username = response.data.username;
          user.roles = response.data.roles;
          user.bio = response.data.bio;
          user.notifications = response.data.notifications;
          user.refresh = response.data.refresh;
          user.access = response.data.access;
          user.created = response.data.created;
          return true;
        } catch (err) {
          return false;
        }
      }
      if (account.provider === 'facebook') {
        console.log(account);
        console.log(user);
        console.log(profile);
        try {
          const response = await axios.post('auth/facebook/', {
            auth_token: account.accessToken,
          });
          user.idx = response.data.idx;
          user.avatar = response.data.avatar || profile.picture;
          user.email = response.data.email;
          user.first_name = response.data.first_name;
          user.last_name = response.data.last_name;
          user.phone = response.data.phone;
          user.is_active = response.data.is_active;
          user.username = response.data.username;
          user.roles = response.data.roles;
          user.bio = response.data.bio;
          user.notifications = response.data.notifications;
          user.refresh = response.data.refresh;
          user.access = response.data.access;
          user.created = response.data.created;
          return true;
        } catch (err) {
          return false;
        }
      }

      return true;
    }, */
    async jwt({ user, token, trigger, session }) {
      if (trigger === 'update' && session) token.user = session;
      else if (user) token.user = user;

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  providers: [
    /* GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }), */
    CredentialsProvider({
      credentials: {},
      authorize: async credentials => {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
          body: JSON.stringify(credentials),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(data));

        return data;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default authOptions;
