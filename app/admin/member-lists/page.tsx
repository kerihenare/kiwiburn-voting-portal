import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Eye } from 'lucide-react'
import Link from 'next/link'
import { CreateMemberListDialog } from './create-member-list-dialog'

async function getMemberLists() {
  const supabase = await createClient()
  
  const { data: memberLists, error } = await supabase
    .from('member_lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching member lists:', error)
    return []
  }

  // Get member counts for each list
  const listsWithCounts = await Promise.all(
    (memberLists || []).map(async (list) => {
      const { count } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .eq('member_list_id', list.id)

      return {
        ...list,
        member_count: count || 0,
      }
    })
  )

  return listsWithCounts
}

export default async function MemberListsPage() {
  const memberLists = await getMemberLists()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member Lists</h1>
          <p className="text-muted-foreground mt-1">
            Manage member lists that determine voting eligibility
          </p>
        </div>
        <CreateMemberListDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Member Lists</CardTitle>
          <CardDescription>
            {memberLists.length} member list{memberLists.length !== 1 ? 's' : ''} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {memberLists.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">{list.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {list.description || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {list.member_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(list.created_at).toLocaleDateString('en-NZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/member-lists/${list.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No member lists</h3>
              <p className="text-muted-foreground mb-4">
                Create your first member list to start managing voting eligibility.
              </p>
              <CreateMemberListDialog />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
