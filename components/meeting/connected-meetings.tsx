import type { SerializedMeeting } from "@/app/actions/meetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConnectedMeetings({
  previousMeetings,
  nextMeetings,
}: {
  previousMeetings: SerializedMeeting[];
  nextMeetings: SerializedMeeting[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Previous Meetings */}
          {previousMeetings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                Previous Meetings
              </h3>
              <div className="space-y-2">
                {previousMeetings.map((meeting) => (
                  <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{meeting.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(meeting.startTime), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Next Meetings */}
          {nextMeetings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                Next Meetings
              </h3>
              <div className="space-y-2">
                {nextMeetings.map((meeting) => (
                  <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{meeting.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(meeting.startTime), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

