import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (
                    credentials.username === process.env.ADMIN_USERNAME &&
                    credentials.password === process.env.ADMIN_PASSWORD
                ) {
                    return { id: 1, name: "Admin" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt'
    }
}

export default NextAuth(authOptions)
