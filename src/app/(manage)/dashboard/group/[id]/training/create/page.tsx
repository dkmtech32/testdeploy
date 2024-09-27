import CreateGroupTraining from "@/components/admin/group/create-group-training";
import React from "react";

function CreateGroupTrainingPage({ params }: { params: { id: number } }) {
  return <CreateGroupTraining groupId={params.id} />;
}

export default CreateGroupTrainingPage;
