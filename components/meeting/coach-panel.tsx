import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CoachPanel({
  score,
  feedback,
}: {
  score: number;
  feedback: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Meeting Score</span>
              <span className="text-sm font-semibold">{score}/10</span>
            </div>
            <Progress value={score * 10} className="h-2" />
          </div>

          {/* Feedback */}
          <div>
            <div className="text-sm font-medium mb-2">Feedback</div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-sm">{feedback}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

