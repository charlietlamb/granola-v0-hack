"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getObjectives } from "@/app/actions/objectives";

type Project = {
    id: string;
    name: string;
    summary?: string;
    movedForward: boolean;
};

type InsightsProps = {
    thisWeekMinutes: number; // total minutes spent in meetings this week
    lastWeekMinutes?: number; // optional, for comparative
    participationPercent?: number; // % of meeting time you actively participated
    projects?: Project[]; // projects that moved forward or were discussed
    timeSaverNote?: string; // e.g. "3 meetings can be emails"
};



function minutesToHours(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
}

function changeInfo(thisWeek: number, lastWeek?: number) {
    if (lastWeek === undefined || lastWeek === 0) {
        return { label: "—", positive: null };
    }
    const diff = thisWeek - lastWeek;
    const pct = Math.round((diff / lastWeek) * 100);
    return { label: `${pct > 0 ? "+" : ""}${pct}%`, positive: pct > 0 ? true : pct < 0 ? false : null };
}

export { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function InsightsSidebar({
    thisWeekMinutes,
    lastWeekMinutes,
    participationPercent,
    projects = [],
    timeSaverNote = "3 meetings can be emails",
}: InsightsProps) {
    const change = changeInfo(thisWeekMinutes, lastWeekMinutes);
    const movedProjects = projects.filter((p) => p.movedForward);
    const router = useRouter();

    const { data: objectives, isLoading: objectivesLoading } = useQuery({
        queryKey: ["objectives"],
        queryFn: getObjectives,
    });

    return (
        <Sidebar className="w-80 border-l">
            <SidebarHeader className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Meeting Insights</h2>
                <p className="text-sm text-muted-foreground">Weekly performance overview</p>
            </SidebarHeader>

            <SidebarContent className="px-4 py-2">
                {/* Time in meetings */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
                        Time in meetings — this week
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <div className="text-2xl font-semibold text-foreground">
                                    {minutesToHours(thisWeekMinutes)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-medium ${
                                    change.positive === null ? "text-muted-foreground" :
                                    change.positive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                                }`}>
                                    {change.positive === true ? "↑" : change.positive === false ? "↓" : "—"}{" "}
                                    {change.label}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {lastWeekMinutes !== undefined ?
                                        `Last week ${minutesToHours(lastWeekMinutes)}` :
                                        "No last-week data"
                                    }
                                </div>
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Participation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
                        Participation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="p-3 bg-muted rounded-lg space-y-2">
                            <div className="text-sm text-foreground">
                                {participationPercent !== undefined ?
                                    `${Math.round(participationPercent)}% of meeting time actively participated` :
                                    "Participation data not available"
                                }
                            </div>
                            {participationPercent !== undefined && (
                                <Progress value={participationPercent} className="h-2" />
                            )}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Projects that moved forward */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
                        Projects that moved forward
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="p-3 bg-muted rounded-lg">
                            {movedProjects.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No tracked projects moved forward this week</div>
                            ) : (
                                <SidebarMenu>
                                    {movedProjects.map((p) => (
                                        <SidebarMenuItem key={p.id} className="py-1">
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 bg-green-500 dark:bg-green-400 rounded-sm flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-foreground truncate">
                                                        {p.name}
                                                    </div>
                                                    {p.summary && (
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            {p.summary}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Time saver */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
                        Time saver
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="text-sm text-amber-900 dark:text-amber-100">{timeSaverNote}</div>
                            <div className="text-xl">💡</div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Objectives */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
                        Objectives
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="p-3 bg-muted rounded-lg">
                            {objectivesLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            ) : !objectives || objectives.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No objectives found</div>
                            ) : (
                                <SidebarMenu>
                                    {objectives.map((objective) => (
                                        <SidebarMenuItem key={objective.id} className="py-1">
                                            <div
                                                className="p-2 cursor-pointer hover:bg-background hover:shadow-sm transition-all rounded-md text-sm border border-transparent hover:border-border"
                                                onClick={() => router.push(`/objective/${objective.id}`)}
                                            >
                                                <div className="font-medium text-foreground text-sm">
                                                    {objective.name}
                                                </div>
                                            </div>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default function Insights(props: InsightsProps) {
    return (
        <SidebarProvider>
            <InsightsSidebar {...props} />
        </SidebarProvider>
    );
}

// Example usage (for quick local testing):
// <Insights
//   thisWeekMinutes={320}
//   lastWeekMinutes={410}
//   participationPercent={62}
//   projects={[{ id: "1", name: "Landing page revamp", movedForward: true, summary: "Design accepted" }, { id: "2", name: "API budget", movedForward: false }]}
//   timeSaverNote="3 meetings can be emails"
// />
//
// Or use the sidebar component directly:
// <SidebarProvider>
//   <InsightsSidebar {...props} />
//   <SidebarInset>
//     {/* Your main content goes here */}
//   </SidebarInset>
// </SidebarProvider>