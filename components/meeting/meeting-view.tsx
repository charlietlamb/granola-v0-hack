"use client";

import { parseISO } from "date-fns";
import { useState } from "react";
import type { MeetingDetail } from "@/app/actions/meetings";
import AgendaView from "./agenda-view";
import PreparationBanner from "./preparation-banner";
import NotesAndActions from "./notes-and-actions";
import ConnectedMeetings from "./connected-meetings";
import CoachPanel from "./coach-panel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function MeetingView({
  meetingDetail,
}: {
  meetingDetail: MeetingDetail;
}) {
  const { meeting, agenda, notes, actionItems, previousMeetings, nextMeetings } =
    meetingDetail;
  const startTime = parseISO(meeting.startTime);
  const isUpcoming = startTime > new Date();

  const [agendaOpen, setAgendaOpen] = useState(false);
  const [preparationOpen, setPreparationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
          >
            ← Back to meetings
          </Link>
          <h1 className="text-2xl font-semibold mb-2">{meeting.name}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{startTime.toLocaleDateString()}</span>
            <span>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            {meetingDetail.objective && (
              <span className="text-foreground">
                Objective: {meetingDetail.objective.name}
              </span>
            )}
          </div>
        </div>

        {/* Upcoming meeting: Only show Agenda and Preparation */}
        {isUpcoming ? (
          <div className="space-y-6">
            {agenda && <AgendaView agenda={agenda} />}
            {meetingDetail.preparationInfo && (
              <PreparationBanner preparationInfo={meetingDetail.preparationInfo} />
            )}
          </div>
        ) : (
          /* Past meeting: Show everything with collapsible Agenda and Preparation */
          <div className="space-y-6">
            {/* Collapsible Agenda */}
            {agenda && (
              <Collapsible open={agendaOpen} onOpenChange={setAgendaOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-semibold text-lg"
                  >
                    <span>Agenda</span>
                    {agendaOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    <AgendaView agenda={agenda} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Collapsible Preparation */}
            {meetingDetail.preparationInfo && (
              <Collapsible open={preparationOpen} onOpenChange={setPreparationOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-semibold text-lg"
                  >
                    <span>Preparation</span>
                    {preparationOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    <PreparationBanner preparationInfo={meetingDetail.preparationInfo} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Notes and Actions */}
            {(notes || actionItems.length > 0) && (
              <NotesAndActions notes={notes} actionItems={actionItems} />
            )}

            {/* Connected Meetings */}
            {(previousMeetings.length > 0 || nextMeetings.length > 0) && (
              <ConnectedMeetings
                previousMeetings={previousMeetings}
                nextMeetings={nextMeetings}
              />
            )}

            {/* Coach Panel */}
            {meeting.coachScore !== undefined && meeting.coachFeedback && (
              <CoachPanel
                score={meeting.coachScore}
                feedback={meeting.coachFeedback}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

