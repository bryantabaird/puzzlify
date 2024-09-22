import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Adventure } from "@prisma/client";
import Link from "next/link";

export default function StartTimeCard({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) {
  return (
    <Card className="transition-all ease-in-out duration-300 hover:bg-muted focus:border-ring">
      <Link href={`/adventure/${adventureId}/edit`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Adventure Timer
          </CardTitle>
          <Clock />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7d 10h 5m 20s</div>
          <p className="text-xs text-muted-foreground">
            Time elapsed since adventure began
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
