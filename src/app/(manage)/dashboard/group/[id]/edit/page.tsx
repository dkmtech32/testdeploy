import EditGroup from '@/components/admin/group/edit'
import React from 'react'

function EditGroupPage({ params }: { params: { id: number } }) {
  return (
    <EditGroup id={params.id} />
  )
}

export default EditGroupPage