import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { TopicCard } from '@/components/topic-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, Vote } from 'lucide-react'
import Link from 'next/link'
import type { Topic } from '@/lib/types'

async function getTopics() {
  const supabase = await createClient()
  
  const { data: topics, error } = await supabase
    .from('topics')
    .select(`
      *,
      member_list:member_lists(id, name)
    `)
    .eq('voting_open', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }

  // Get vote counts and member counts for each topic
  const topicsWithCounts = await Promise.all(
    (topics || []).map(async (topic) => {
      const [voteCountResult, memberCountResult] = await Promise.all([
        supabase
          .from('votes')
          .select('id', { count: 'exact', head: true })
          .eq('topic_id', topic.id),
        supabase
          .from('members')
          .select('id', { count: 'exact', head: true })
          .eq('member_list_id', topic.member_list_id),
      ])

      return {
        ...topic,
        total_votes: voteCountResult.count || 0,
        total_members: memberCountResult.count || 0,
      }
    })
  )

  return topicsWithCounts
}

async function getUserVotes(userId: string | null, topicIds: string[]) {
  if (!userId || topicIds.length === 0) return new Set<string>()
  
  const supabase = await createClient()
  
  // First get member IDs for this user's email
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return new Set<string>()

  const { data: members } = await supabase
    .from('members')
    .select('id')
    .eq('email', user.email)

  if (!members || members.length === 0) return new Set<string>()
  
  const memberIds = members.map(m => m.id)

  const { data: votes } = await supabase
    .from('votes')
    .select('topic_id')
    .in('topic_id', topicIds)
    .in('member_id', memberIds)

  return new Set((votes || []).map(v => v.topic_id))
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const topics = await getTopics()
  const topicIds = topics.map((t: Topic) => t.id)
  const userVotedTopics = await getUserVotes(user?.id || null, topicIds)

  // Check if user is admin (for now, we'll use a simple email check - can be made more sophisticated)
  const isAdmin = user?.email?.endsWith('@kiwiburn.com') || false

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} isAdmin={isAdmin} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Flame className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Kiwiburn Voting Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your voice matters. Cast your vote on important community decisions and help shape the future of Kiwiburn.
          </p>
        </section>

        {/* Topics Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Open Topics</h2>
            {!user && (
              <Button asChild>
                <Link href="/sign-in">
                  <Vote className="h-4 w-4 mr-2" />
                  Sign in to vote
                </Link>
              </Button>
            )}
          </div>

          {topics.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic: Topic & { total_votes?: number; total_members?: number }) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic}
                  userHasVoted={userVotedTopics.has(topic.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No open topics</h3>
                <p className="text-muted-foreground">
                  There are no topics currently open for voting. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Kiwiburn Voting Portal - Community decisions made together</p>
        </div>
      </footer>
    </div>
  )
}
