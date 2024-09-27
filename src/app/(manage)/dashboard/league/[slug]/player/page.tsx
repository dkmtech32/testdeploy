import LeaguePlayer from '@/components/admin/league/player'
import React from 'react'

function LeaguePlayerPage({ params }: { params: { slug: string } }) {

  return (
    <LeaguePlayer slug={params.slug}/>
    // <div>{params.slug}</div>
  )
}

export default LeaguePlayerPage