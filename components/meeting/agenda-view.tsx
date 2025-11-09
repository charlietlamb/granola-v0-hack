import type { SerializedAgenda } from "@/app/actions/meetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgendaView({ agenda }: { agenda: SerializedAgenda }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{agenda.agenda}</p>
        </div>
      </CardContent>
    </Card>
  );
}

