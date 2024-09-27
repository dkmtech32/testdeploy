import EditLeague from '@/components/admin/league/edit'
import React from 'react'

function LeagueEditPage({ params }: { params: { slug: string } }) {
  return (
    <EditLeague slug={params.slug}/>
  )
}

export default LeagueEditPage