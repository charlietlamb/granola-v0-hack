import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PreparationBanner({
  preparationInfo,
}: {
  preparationInfo: string;
}) {
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <AlertDescription className="text-sm">
        <div className="font-semibold mb-2">Preparation</div>
        <p className="whitespace-pre-wrap">{preparationInfo}</p>
      </AlertDescription>
    </Alert>
  );
}

