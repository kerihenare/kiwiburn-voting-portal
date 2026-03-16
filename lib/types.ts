export interface MemberList {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  member_list_id: string
  email: string
  name: string | null
  created_at: string
}

export interface Topic {
  id: string
  title: string
  description: string | null
  member_list_id: string
  voting_open: boolean
  closes_at: string | null
  created_at: string
  updated_at: string
  member_list?: MemberList
}

export interface Vote {
  id: string
  topic_id: string
  member_id: string
  vote_value: 'yes' | 'no' | 'abstain'
  created_at: string
  updated_at: string
}

export interface TopicWithVoteCounts extends Topic {
  yes_count: number
  no_count: number
  abstain_count: number
  total_votes: number
  total_members: number
}

export interface VotingEligibility {
  eligible: boolean
  member_id: string | null
  has_voted: boolean
  current_vote: Vote | null
}
