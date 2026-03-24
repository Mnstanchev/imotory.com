import { signOut } from '@/auth'

export async function GET() {
  await signOut({ redirect: false })
  return Response.json({ success: true, message: 'Logged out successfully' })
}