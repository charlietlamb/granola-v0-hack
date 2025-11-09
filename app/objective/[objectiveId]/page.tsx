import ObjectiveView from "@/components/objective/objective-view";

interface ObjectivePageProps {
  params: Promise<{
    objectiveId: string;
  }>;
}

export default async function ObjectivePage({ params }: ObjectivePageProps) {
  const { objectiveId } = await params;
  return <ObjectiveView objectiveId={objectiveId} />;
}
