import type {
  SerializedMeetingNote,
  SerializedActionItem,
} from "@/app/actions/meetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export default function NotesAndActions({
  notes,
  actionItems,
}: {
  notes: SerializedMeetingNote | null;
  actionItems: SerializedActionItem[];
}) {
  return (
    <div className="space-y-6">
      {/* Meeting Notes */}
      {notes && (
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{notes.aiSummary}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.assignedTo.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "default"
                            : item.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {item.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.dueDate
                        ? format(parseISO(item.dueDate), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

