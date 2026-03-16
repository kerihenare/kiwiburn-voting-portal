import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Upload, Trash2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddMemberDialog } from './add-member-dialog'
import { UploadMembersDialog } from './upload-members-dialog'
import { DeleteMemberButton } from './delete-member-button'
import { DeleteMemberListButton } from './delete-member-list-button'

interface MemberListDetailPageProps {
  params: Promise<{ id: string }>
}

async function getMemberList(id: string) {
  const supabase = await createClient()
  
  const { data: memberList, error } = await supabase
    .from('member_lists')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !memberList) {
    return null
  }

  return memberList
}

async function getMembers(memberListId: string) {
  const supabase = await createClient()
  
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .eq('member_list_id', memberListId)
    .order('email', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }

  return members || []
}

export default async function MemberListDetailPage({ params }: MemberListDetailPageProps) {
  const { id } = await params
  const memberList = await getMemberList(id)
  
  if (!memberList) {
    notFound()
  }

  const members = await getMembers(id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/member-lists">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{memberList.name}</h1>
          {memberList.description && (
            <p className="text-muted-foreground mt-1">{memberList.description}</p>
          )}
        </div>
        <DeleteMemberListButton memberListId={id} memberListName={memberList.name} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {members.length} member{members.length !== 1 ? 's' : ''} in this list
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <UploadMembersDialog memberListId={id} />
            <AddMemberDialog memberListId={id} />
          </div>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.name || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString('en-NZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteMemberButton memberId={member.id} memberEmail={member.email} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No members yet</h3>
              <p className="text-muted-foreground mb-4">
                Add members individually or upload a CSV file.
              </p>
              <div className="flex justify-center gap-2">
                <UploadMembersDialog memberListId={id} />
                <AddMemberDialog memberListId={id} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
