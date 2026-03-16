import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getAllMemberLists } from "@/lib/db/queries"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) {
    return NextResponse.json([], { status: 403 })
  }

  const lists = await getAllMemberLists()
  return NextResponse.json(lists)
}
