import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Vote } from 'lucide-react'
import type { Topic } from '@/lib/types'

interface TopicCardProps {
  topic: Topic & {
    total_votes?: number
    total_members?: number
  }
  userHasVoted?: boolean
}

export function TopicCard({ topic, userHasVoted }: TopicCardProps) {
  const isOpen = topic.voting_open
  const closesAt = topic.closes_at ? new Date(topic.closes_at) : null
  const isClosed = closesAt && closesAt < new Date()

  const formatClosingDate = (date: Date) => {
    return date.toLocaleDateString('en-NZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={isOpen && !isClosed ? 'default' : 'secondary'}>
            {isClosed ? 'Closed' : isOpen ? 'Open' : 'Not yet open'}
          </Badge>
          {userHasVoted && (
            <Badge variant="outline" className="text-primary border-primary">
              Voted
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl leading-tight">{topic.title}</CardTitle>
        {topic.description && (
          <CardDescription className="line-clamp-3 mt-2">
            {topic.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {closesAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{isClosed ? 'Closed' : `Closes ${formatClosingDate(closesAt)}`}</span>
              </div>
            )}
            {topic.total_members !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{topic.total_members} eligible</span>
              </div>
            )}
          </div>
          {topic.total_votes !== undefined && topic.total_members !== undefined && (
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ 
                  width: `${topic.total_members > 0 ? (topic.total_votes / topic.total_members) * 100 : 0}%` 
                }}
              />
            </div>
          )}
          <Button 
            asChild 
            variant={isOpen && !isClosed ? 'default' : 'outline'}
            className="w-full"
          >
            <Link href={`/vote/${topic.id}`}>
              <Vote className="h-4 w-4 mr-2" />
              {isClosed ? 'View results' : userHasVoted ? 'Change vote' : 'Cast your vote'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
