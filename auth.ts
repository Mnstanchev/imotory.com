import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials: any) {
        if (credentials?.email === "admin@imotory.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@imotory.com",
            name: "Admin User",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
})
