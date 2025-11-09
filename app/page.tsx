import CalendarList from "@/components/home/calendar-list";
import { InsightsSidebar, SidebarProvider, SidebarInset } from "@/components/home/insights";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarInset className="flex-1">
          <CalendarList />
        </SidebarInset>
        <InsightsSidebar
          thisWeekMinutes={320}
          lastWeekMinutes={410}
          participationPercent={62}
          projects={[{ id: "1", name: "Landing page revamp", movedForward: true, summary: "Design accepted" }, { id: "2", name: "API budget", movedForward: false }]}
          timeSaverNote="3 meetings can be emails"
        />
      </div>
    </SidebarProvider>
  );
}
