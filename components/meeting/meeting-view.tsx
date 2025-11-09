"use client";

import { parseISO, format } from "date-fns";
import { useState } from "react";
import type { MeetingDetail } from "@/app/actions/meetings";
import AgendaView from "./agenda-view";
import PreparationBanner from "./preparation-banner";
import NotesAndActions from "./notes-and-actions";
import ConnectedMeetings from "./connected-meetings";
import CoachPanel from "./coach-panel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

  // Determine default tab based on meeting status
  const defaultTab = isUpcoming ? "coach" : (meeting.coachScore !== undefined && meeting.coachFeedback ? "coach" : "notes");

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
            <span>{format(startTime, "dd/MM/yyyy")}</span>
            <span>{format(startTime, "HH:mm")}</span>
            {meetingDetail.objective && (
              <span className="text-foreground">
                Objective: {meetingDetail.objective.name}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="coach">Coach</TabsTrigger>
            <TabsTrigger value="notes">Meeting notes</TabsTrigger>
            <TabsTrigger value="actions">Action items</TabsTrigger>
            <TabsTrigger value="connected">Connected meetings</TabsTrigger>
          </TabsList>

          {/* Coach Tab */}
          <TabsContent value="coach" className="mt-6">
            <div className="space-y-6">
              {/* Show coach feedback if available */}
              {meeting.coachScore !== undefined && meeting.coachFeedback ? (
                <CoachPanel
                  score={meeting.coachScore}
                  feedback={meeting.coachFeedback}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {isUpcoming 
                      ? "Coach feedback will be available after the meeting" 
                      : "No coach feedback available for this meeting"
                    }
                  </p>
                </div>
              )}

              {/* Show agenda and preparation for upcoming meetings */}
              {isUpcoming && (
                <>
                  {agenda && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Agenda</h3>
                      <AgendaView agenda={agenda} />
                    </div>
                  )}
                  {meetingDetail.preparationInfo && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Preparation</h3>
                      <PreparationBanner preparationInfo={meetingDetail.preparationInfo} />
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Meeting Notes Tab */}
          <TabsContent value="notes" className="mt-6">
            {notes ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Meeting Notes</h3>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{notes.aiSummary}</div>
                </div>
                {notes.rawTranscript && (
                  <div className="mt-6">
                    <h4 className="text-base font-semibold mb-3">Raw Transcript</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="whitespace-pre-wrap text-xs text-muted-foreground">
                        {notes.rawTranscript}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No meeting notes available</p>
              </div>
            )}

            {/* Include agenda and preparation in notes for past meetings */}
            {!isUpcoming && (
              <div className="mt-8 space-y-6">
                {agenda && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Agenda</h3>
                    <AgendaView agenda={agenda} />
                  </div>
                )}
                {meetingDetail.preparationInfo && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Preparation</h3>
                    <PreparationBanner preparationInfo={meetingDetail.preparationInfo} />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="mt-6">
            {actionItems && actionItems.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Action Items</h3>
                <div className="space-y-3">
                  {actionItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.item}</div>
                        {item.assignedTo && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Assigned to: {item.assignedTo.name}
                          </div>
                        )}
                        {item.dueDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(item.dueDate), "dd/MM/yyyy")}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Status: {item.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No action items for this meeting</p>
              </div>
            )}
          </TabsContent>

          {/* Connected Meetings Tab */}
          <TabsContent value="connected" className="mt-6">
            {(previousMeetings.length > 0 || nextMeetings.length > 0) ? (
              <ConnectedMeetings
                previousMeetings={previousMeetings}
                nextMeetings={nextMeetings}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No connected meetings found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

