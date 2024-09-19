import { Adventure, User } from "@prisma/client";
import Builder from "./drag-drop/Builder";

export default async function HostStagesView({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  return <Builder />;
}

// import { getAdventureLayout } from "@/server/fetchers/get-adventure-layout";
// import getGraphFromAdventure from "@/utils/getGraphFromAdventure";
// import { Adventure, User } from "@prisma/client";
// import { ReactFlowProvider } from "@xyflow/react";
// import HostStageLayout from "./HostStageLayout";

// export default async function HostStagesView({
//   userId,
//   adventureId,
// }: {
//   userId: User["id"];
//   adventureId: Adventure["id"];
// }) {
//   const adventure = await getAdventureLayout(adventureId);

//   if (!adventure) {
//     return (
//       <div>
//         <h1>Adventure not found</h1>
//       </div>
//     );
//   }

//   const { nodes: initialNodes, edges: initialEdges } =
//     getGraphFromAdventure(adventure);

//   console.log("initialNodes", initialNodes);
//   console.log("initialEdges", initialEdges);

//   return (
//     <div className="flex flex-col lg:flex-row flex-1">
//       <ReactFlowProvider>
//         <div className="lg:w-1/3 lg:h-full w-full h-1/2">
//           <HostStageLayout
//             adventureId={adventureId}
//             initialNodes={initialNodes}
//             initialEdges={initialEdges}
//           />
//         </div>
//       </ReactFlowProvider>
//       <div className="m-12 flex flex-1 flex-col border-opacity-50 justify-center items-center">
//         <div className="card w-1/2 bg-base-300 rounded-box grid h-20 place-items-center">
//           Select a Stage
//         </div>
//         <div className="divider">OR</div>
//         <button className="w-1/2 btn btn-primary">Create a New Stage</button>
//       </div>
//     </div>
//   );
// }
