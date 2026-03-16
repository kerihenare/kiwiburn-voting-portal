import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAllMemberLists } from "@/lib/db/queries"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) {
    return NextResponse.json([], { status: 403 })
  }

  const lists = await getAllMemberLists()
  return NextResponse.json(lists)
}
