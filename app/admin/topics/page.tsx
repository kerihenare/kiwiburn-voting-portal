import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Vote, Eye, Users } from 'lucide-react'
import Link from 'next/link'
import { CreateTopicDialog } from './create-topic-dialog'

async function getTopics() {
  const supabase = await createClient()
  
  const { data: topics, error } = await supabase
    .from('topics')
    .select(`
      *,
      member_list:member_lists(id, name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }

  // Get vote counts for each topic
  const topicsWithCounts = await Promise.all(
    (topics || []).map(async (topic) => {
      const { count } = await supabase
        .from('votes')
        .select('id', { count: 'exact', head: true })
        .eq('topic_id', topic.id)

      return {
        ...topic,
        vote_count: count || 0,
      }
    })
  )

  return topicsWithCounts
}

async function getMemberLists() {
  const supabase = await createClient()
  
  const { data: memberLists, error } = await supabase
    .from('member_lists')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching member lists:', error)
    return []
  }

  return memberLists || []
}

export default async function TopicsPage() {
  const [topics, memberLists] = await Promise.all([
    getTopics(),
    getMemberLists(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Topics</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage voting topics
          </p>
        </div>
        <CreateTopicDialog memberLists={memberLists} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Topics</CardTitle>
          <CardDescription>
            {topics.length} topic{topics.length !== 1 ? 's' : ''} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Member List</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Closes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => {
                  const closesAt = topic.closes_at ? new Date(topic.closes_at) : null
                  const isClosed = closesAt && closesAt < new Date()
                  
                  return (
                    <TableRow key={topic.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{topic.title}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {topic.member_list?.name || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={topic.voting_open && !isClosed ? 'default' : 'secondary'}>
                          {isClosed ? 'Closed' : topic.voting_open ? 'Open' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Vote className="h-3 w-3 mr-1" />
                          {topic.vote_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {closesAt 
                          ? closesAt.toLocaleDateString('en-NZ', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit'
                            })
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/topics/${topic.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No topics</h3>
              <p className="text-muted-foreground mb-4">
                Create your first topic to start collecting votes.
              </p>
              <CreateTopicDialog memberLists={memberLists} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
