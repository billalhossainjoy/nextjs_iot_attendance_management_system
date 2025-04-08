import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    signIn: async ({ profile }) => {
      const email = profile?.email;

      if (!email) return false;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });


      if (!user || user.email !== email) return false;

      return true;
    },
  },
});

export { handler as GET, handler as POST };
