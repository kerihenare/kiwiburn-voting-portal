# Kiwiburn Voting Portal --- Product Requirements Document (PRD)

------------------------------------------------------------------------

# 1. Product Overview

The **Kiwiburn Voting Portal** is a secure online platform that allows
members of the Kiwiburn Incorporated Society to participate in official
votes and community decisions.

The portal enables:

- transparent community voting
- controlled voter eligibility
- secure authentication
- auditable vote records

It supports Kiwiburn's governance obligations under the **New Zealand
Incorporated Societies Act 2022**, which requires member participation
in certain decisions.

The system prioritises **simplicity, trust, and accessibility**,
ensuring all eligible members can easily participate in votes.

------------------------------------------------------------------------

# 2. Problem Statement

Kiwiburn currently lacks a dedicated digital platform for structured
member voting.

Existing processes rely on email or forum polls

These approaches introduce several issues:

### Lack of eligibility control

It is difficult to guarantee only eligible members participate in votes.

### Lack of transparency

Vote outcomes may not be easily verifiable by the community.

### Administrative overhead

Manual vote counting and administration requires significant volunteer
time.

### Accessibility barriers

Members who cannot attend meetings may not be able to vote.

------------------------------------------------------------------------

# 3. Goals

The Voting Portal aims to achieve the following goals.

### Enable secure member voting

Eligible members can cast votes online in a secure environment.

### Reduce administrative workload

Voting administration should require minimal manual work.

### Improve transparency

Vote outcomes should be visible and understandable.

### Increase participation

Members should be able to vote easily from any device.

### Support governance processes

The platform should support official Kiwiburn governance decisions.

------------------------------------------------------------------------

# 4. Non-Goals

The system intentionally does **not** include the following features.

- Complex voting systems (initial version supports **Yes / No voting
    only**)
- Anonymous voting
- Discussion forums
- General community polling

The portal exists specifically for **official Kiwiburn votes**.

------------------------------------------------------------------------

# 5. Success Metrics

  Metric                                    Target
  ----------------------------------------- ------------------
  Member vote participation rate            \> 40%
  Time required to create a vote            \< 2 minutes
  Administrative effort for vote counting   Zero manual work
  Vote reliability                          100% accuracy
  System uptime during active votes         \> 99.9%

------------------------------------------------------------------------

# 6. User Roles

## Member

Members are Kiwiburn participants who may be eligible to vote.

Capabilities:

- sign in using email magic link
- view voting topics
- cast votes
- view vote results

------------------------------------------------------------------------

## Administrator

Administrators manage the voting system.

Capabilities:

- create topics
- manage member lists
- upload members via CSV

------------------------------------------------------------------------

# 7. User Stories

## Member Stories

**As a member**
I want to see past and current votes
So that I know what decisions are happening.

**As a member**
I want to vote quickly from my phone
So that participation is easy.

**As a member**
I want confirmation that my vote was recorded
So that I trust the system.

**As a member**
I want to change my vote while voting is open
So that I can correct mistakes.

------------------------------------------------------------------------

## Administrator Stories

**As an administrator**
I want to create a voting topic
So that members can vote on decisions.

**As an administrator**
I want to define which members can vote
So that votes are restricted to eligible participants.

**As an administrator**
I want to upload members via CSV
So that voter lists can be managed easily.

------------------------------------------------------------------------

# 8. Functional Requirements

## Authentication

Users must authenticate using **email magic links**.

Requirements:

- email address input
- login link emailed to user
- link creates authenticated session

------------------------------------------------------------------------

## Voting

Users must be able to cast a vote.

Requirements:

- vote options: Yes / No
- vote stored in database
- vote tied to user ID
- vote confirmation email sent

Users may change their vote until the topic closes.

------------------------------------------------------------------------

## Topic Management

Administrators must be able to create voting topics.

Required fields:

- title
- description
- member list
- opens date/time
- closes date/time

------------------------------------------------------------------------

## Member Lists

Administrators must be able to manage lists of eligible voters.

Capabilities:

- create member lists
- add members individually
- bulk upload members via CSV
- remove members

------------------------------------------------------------------------

## Vote Results

Users must be able to see results when voting closes.

Displayed information:

- yes percentage
- no percentage
- total votes

------------------------------------------------------------------------

# 9. Eligibility Rules

A user may vote on a topic if:

1.  The user is authenticated.
2.  The user is included in the topic's **Member List**.
3.  The topic is currently open.

------------------------------------------------------------------------

# 10. Security Requirements

The system must enforce the following rules.

### One vote per user per topic

The database must prevent duplicate votes.

### Authenticated voting only

Anonymous votes are not allowed.

### Secure authentication

Magic links must expire after a short period.

### Vote integrity

Votes must not be modifiable after the vote closes.

------------------------------------------------------------------------

# 11. Technical Requirements

Stack:

- NextJS
- React
- TailwindCSS
- Shadcn UI
- NodeJS
- Postgres (Supabase)
- Drizzle ORM
- Better-Auth
- React Email
- Nodemailer

------------------------------------------------------------------------

# 12. Performance Requirements

  Parameter           Expected
  ------------------- ----------
  Members             \< 5,000
  Concurrent voters   \< 500
  Topics per year     \< 20

The system must support these loads without degradation.

------------------------------------------------------------------------

# 13. Accessibility Requirements

The portal must meet strong accessibility standards.

Requirements:

- keyboard navigation
- screen reader compatibility
- focus states
- semantic HTML
- high contrast colour usage

------------------------------------------------------------------------

# 14. UX Requirements

The portal must:

- be mobile friendly
- require minimal navigation
- minimise user input
- present results clearly

------------------------------------------------------------------------

# 15. Risks

## 15.1. Low participation

Mitigation:

- email notifications
- simple voting experience

------------------------------------------------------------------------

## 15.2. Incorrect member lists

Mitigation:

- clear admin interface
- CSV validation

------------------------------------------------------------------------

## 15.3. Email deliverability

Mitigation:

- reliable email provider
- resend functionality
