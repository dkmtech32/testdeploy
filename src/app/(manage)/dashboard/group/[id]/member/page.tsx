import GroupMember from '@/components/admin/group/member'
import React from 'react'

function GroupMemberPage( { params }: { params: { id: number } } ) {
  return (
    <GroupMember id={params.id} />

  )
}

export default GroupMemberPage