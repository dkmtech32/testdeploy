import GroupDetail from '@/components/group/detail'
import React from 'react'

function GroupDetailPage({ params }: { params: { id: number } }) {
  return (
    <GroupDetail id={params.id} />
  )
}

export default GroupDetailPage