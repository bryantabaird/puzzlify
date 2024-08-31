import { Adventure, Stage } from "@prisma/client";
import Link from "next/link";

type Props = {
  adventure: Adventure & { stages: Stage[] };
};

const HostAdventureDashboard = ({ adventure }: Props) => {
  return (
    <div className="p-4">
      <div className="grid auto-rows-fr grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TODO: Render as warning color when threshold is maybe 20% or so */}
        <div className="stat bg-base-300 rounded-box">
          <div className="stat-title text-base-content">Users Signed Up</div>
          <div className="stat-value text-accent">12 / 20</div>
          <div className="stat-actions">
            <button className="btn btn-sm btn-primary">View</button>
          </div>
        </div>

        <div className="stat bg-base-300 shadow-md rounded-box">
          <div className="stat-title text-base-content">Total Stages</div>
          <div className="stat-value text-accent">12</div>
          <div className="stat-actions">
            <button className="btn btn-sm btn-primary">View</button>
          </div>
        </div>

        {/* TODO: Error color if greater than 0 */}
        <div className="stat bg-base-300 shadow-md rounded-box">
          <div className="stat-title text-base-content">Users on Waitlist</div>
          <div className="stat-value text-accent">3</div>
          <div className="stat-actions">
            <button className="btn btn-sm btn-primary">View</button>
          </div>
        </div>

        <div className="stat bg-base-300 shadow-md rounded-box">
          <div className="stat-title text-base-content">Time Remaining</div>
          <div className="stat-value text-accent">10h 5s</div>
          <div className="stat-actions">
            <button className="btn btn-sm btn-primary">View</button>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 sm:row-span-2">
          <div className="flex justify-center items-center h-full bg-base-300">
            Empty graph for now
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 sm:row-span-2">
          <div className="flex justify-center items-center h-full bg-base-300">
            Empty graph for now
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <>
  //     <Link href={`/adventure/${adventure.id}/edit`} className="mx-2 underline">
  //       Edit Adventure
  //     </Link>
  //     <h2>Stages</h2>
  //     <ul>
  //       {adventure.stages.map((stage: Stage) => (
  //         <li key={stage.id}>
  //           <p>
  //             <strong>Riddle:</strong> {stage.riddle}
  //           </p>
  //           <p>
  //             <strong>Answer:</strong> {stage.answer}
  //           </p>
  //           <Link href={`/adventure/${adventure.id}/stage/${stage.id}`}>
  //             View Stage
  //           </Link>
  //         </li>
  //       ))}
  //     </ul>
  //     <Link
  //       href={`/adventure/${adventure.id}/stage/create`}
  //       className="mx-2 underline"
  //     >
  //       Create Stage
  //     </Link>
  //   </>
  // );
};

export default HostAdventureDashboard;
