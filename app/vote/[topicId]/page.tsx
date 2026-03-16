import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { VoteForm } from './vote-form'
import { VoteResults } from './vote-results'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, Clock, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface VotePageProps {
  params: Promise<{ topicId: string }>
}

async function getTopic(topicId: string) {
  const supabase = await createClient()
  
  const { data: topic, error } = await supabase
    .from('topics')
    .select(`
      *,
      member_list:member_lists(id, name)
    `)
    .eq('id', topicId)
    .single()

  if (error || !topic) {
    return null
  }

  return topic
}

async function getVotingEligibility(topicId: string, memberListId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { eligible: false, member_id: null, has_voted: false, current_vote: null }
  }

  // Check if user is a member of the member list
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('member_list_id', memberListId)
    .eq('email', user.email)
    .single()

  if (!member) {
    return { eligible: false, member_id: null, has_voted: false, current_vote: null }
  }

  // Check if user has already voted
  const { data: vote } = await supabase
    .from('votes')
    .select('*')
    .eq('topic_id', topicId)
    .eq('member_id', member.id)
    .single()

  return {
    eligible: true,
    member_id: member.id,
    has_voted: !!vote,
    current_vote: vote,
  }
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

export default async function VotePage({ params }: VotePageProps) {
  const { topicId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const topic = await getTopic(topicId)
  
  if (!topic) {
    notFound()
  }

  const eligibility = user 
    ? await getVotingEligibility(topicId, topic.member_list_id)
    : { eligible: false, member_id: null, has_voted: false, current_vote: null }
  
  const voteCounts = await getVoteCounts(topicId, topic.member_list_id)

  const isAdmin = user?.email?.endsWith('@kiwiburn.com') || false
  const closesAt = topic.closes_at ? new Date(topic.closes_at) : null
  const isClosed = closesAt && closesAt < new Date()
  const canVote = topic.voting_open && !isClosed && eligibility.eligible

  const formatClosingDate = (date: Date) => {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} isAdmin={isAdmin} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to topics
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <Badge variant={topic.voting_open && !isClosed ? 'default' : 'secondary'}>
                {isClosed ? 'Voting closed' : topic.voting_open ? 'Voting open' : 'Not yet open'}
              </Badge>
              {eligibility.has_voted && (
                <Badge variant="outline" className="text-primary border-primary">
                  You have voted
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{topic.title}</CardTitle>
            {topic.description && (
              <CardDescription className="text-base mt-2 whitespace-pre-wrap">
                {topic.description}
              </CardDescription>
            )}
            {closesAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Clock className="h-4 w-4" />
                <span>
                  {isClosed 
                    ? `Voting closed on ${formatClosingDate(closesAt)}`
                    : `Voting closes ${formatClosingDate(closesAt)}`
                  }
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Voting Results */}
            <VoteResults 
              voteCounts={voteCounts}
              showPercentages={isClosed || eligibility.has_voted}
            />

            {/* Voting Form or Status */}
            {!user ? (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Sign in required</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>You need to sign in to cast your vote.</span>
                  <Button asChild size="sm" className="w-fit">
                    <Link href={`/sign-in?redirect=/vote/${topicId}`}>Sign in to vote</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : !eligibility.eligible ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not eligible to vote</AlertTitle>
                <AlertDescription>
                  Your email address is not on the voting list for this topic. 
                  If you believe this is an error, please contact the administrator.
                </AlertDescription>
              </Alert>
            ) : isClosed ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Voting has closed</AlertTitle>
                <AlertDescription>
                  This topic is no longer accepting votes. The results are shown above.
                </AlertDescription>
              </Alert>
            ) : !topic.voting_open ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Voting not yet open</AlertTitle>
                <AlertDescription>
                  This topic is not yet open for voting. Please check back later.
                </AlertDescription>
              </Alert>
            ) : (
              <VoteForm 
                topicId={topicId}
                memberId={eligibility.member_id!}
                currentVote={eligibility.current_vote}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
