import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsCard from "./_components/cards/Teams";
import StagesCard from "./_components/cards/Stages";
import StartTimeCard from "./_components/cards/StartTime";
import OverviewCard from "./_components/cards/Overview";
import { getAdventureStats } from "@/server/db/adventure";
import LeaderboardCard from "./_components/cards/Leaderboard";
import { Suspense } from "react";
import AdventureSwitcherWrapper from "@/components/layout/adventure-switcher-wrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function Dashboard({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await getAdventureStats(adventureId);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Suspense fallback="Loading...">
                <AdventureSwitcherWrapper adventureId={adventureId} />
              </Suspense>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <TeamsCard adventure={adventure} />
                <StagesCard adventure={adventure} />
                <div className="col-span-2 sm:col-span-2">
                  <StartTimeCard />
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2 xl:grid-cols-7">
                <OverviewCard />
                <LeaderboardCard adventureId={adventureId} />
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2 grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Analytics content</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// import { getAdventureStats } from "@/server/db/adventure";
// import TeamAdventureDashboard from "./_components/TeamAdventureDashboard";
// import HostAdventureDashboard from "./_components/HostAdventureDashboard";
// import { getUserId } from "@/server/helpers/getUserId";

// export default async function ViewAdventurePage({
//   params,
// }: {
//   params: { adventureId: string };
// }) {
//   const userId = await getUserId();

//   const adventureId = params.adventureId;
//   const adventure = await getAdventureStats(adventureId);

//   if (!adventure) {
//     return (
//       <div>
//         <h1>Adventure not found</h1>
//       </div>
//     );
//   }

//   const isHost = adventure.hostId === userId;

//   // TODO for host:
//   // If not started:
//   //   Countdown
//   //   Adventure layout (react flow)
//   // If started:
//   //   Stats per stage
//   //   Leaderboard
//   // Both:
//   //   Upgrade options for teams
//   //   Available joiners until paywall hit
//   //   Possible pay to play settings for the host

//   if (isHost) {
//     return <HostAdventureDashboard adventure={adventure} />;
//   } else {
//     return <TeamAdventureDashboard userId={userId} adventure={adventure} />;
//   }
// }
