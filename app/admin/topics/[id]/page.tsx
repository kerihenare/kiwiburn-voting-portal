import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VoteResults } from '@/app/vote/[topicId]/vote-results'
import { ToggleVotingButton } from './toggle-voting-button'
import { DeleteTopicButton } from './delete-topic-button'

interface TopicDetailPageProps {
  params: Promise<{ id: string }>
}

async function getTopic(id: string) {
  const supabase = await createClient()
  
  const { data: topic, error } = await supabase
    .from('topics')
    .select(`
      *,
      member_list:member_lists(id, name)
    `)
    .eq('id', id)
    .single()

  if (error || !topic) {
    return null
  }

  return topic
}

async function getVoteCounts(topicId: string, memberListId: string) {
  const supabase = await createClient()

  const [yesResult, noResult, abstainResult, totalMembersResult] = await Promise.all([
    supabase
      .from('votes')
      .select('id', { count: 'exact', head: true })
      .eq('topic_id', topicId)
      .eq('vote_value', 'yes'),
    supabase
      .from('votes')
      .select('id', { count: 'exact', head: true })
      .eq('topic_id', topicId)
      .eq('vote_value', 'no'),
    supabase
      .from('votes')
      .select('id', { count: 'exact', head: true })
      .eq('topic_id', topicId)
      .eq('vote_value', 'abstain'),
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('member_list_id', memberListId),
  ])

  return {
    yes_count: yesResult.count || 0,
    no_count: noResult.count || 0,
    abstain_count: abstainResult.count || 0,
    total_votes: (yesResult.count || 0) + (noResult.count || 0) + (abstainResult.count || 0),
    total_members: totalMembersResult.count || 0,
  }
}

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { id } = await params
  const topic = await getTopic(id)
  
  if (!topic) {
    notFound()
  }

  const voteCounts = await getVoteCounts(id, topic.member_list_id)
  
  const closesAt = topic.closes_at ? new Date(topic.closes_at) : null
  const isClosed = closesAt && closesAt < new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/topics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={topic.voting_open && !isClosed ? 'default' : 'secondary'}>
              {isClosed ? 'Closed' : topic.voting_open ? 'Open' : 'Draft'}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{topic.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/vote/${id}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Link>
          </Button>
          <DeleteTopicButton topicId={id} topicTitle={topic.title} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topic.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="whitespace-pre-wrap">{topic.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Member List</h4>
                <Link 
                  href={`/admin/member-lists/${topic.member_list_id}`}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Users className="h-4 w-4" />
                  {topic.member_list?.name}
                </Link>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Closing Date</h4>
                {closesAt ? (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(closesAt)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No deadline</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
              <p>{formatDate(new Date(topic.created_at))}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voting Status</CardTitle>
            <CardDescription>
              Control whether members can vote on this topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleVotingButton 
              topicId={id} 
              currentStatus={topic.voting_open}
              isClosed={isClosed || false}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Current voting results for this topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoteResults voteCounts={voteCounts} showPercentages />
        </CardContent>
      </Card>
    </div>
  )
}
