import EditGroupTraining from "@/components/admin/training/edit-group-training";
import React from "react";

function EditGroupTrainingPage({ params }: { params: { id: number } }) {
  return <EditGroupTraining id={params.id} />;
}

export default EditGroupTrainingPage;
