import { notFound } from "next/navigation";
import { getMeetingDetail } from "@/app/actions/meetings";
import MeetingView from "@/components/meeting/meeting-view";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingDetail = await getMeetingDetail(id);

  if (!meetingDetail) {
    notFound();
  }

  return <MeetingView meetingDetail={meetingDetail} />;
}

