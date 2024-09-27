import TrainingList from '@/components/group/trainings'
import React from 'react'

function GroupTrainingPage({ params }: { params: { id: number } }) {
  return (
    <div className='container mx-auto'>
        <TrainingList id={params.id} />
    </div>
  )
}

export default GroupTrainingPage