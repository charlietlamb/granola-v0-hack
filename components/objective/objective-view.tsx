"use client";

interface ObjectiveViewProps {
  objectiveId: string;
}

export default function ObjectiveView({ objectiveId }: ObjectiveViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-8">Objective</h1>
      <div className="text-sm text-muted-foreground">
        Objective ID: {objectiveId}
      </div>
    </div>
  );
}
