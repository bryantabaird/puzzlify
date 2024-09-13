import { Progress, columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

async function getData(): Promise<Progress[]> {
  const mockData = [];

  for (let i = 1; i <= 50; i++) {
    mockData.push({
      id: i.toString(),
      teamName: `Team ${i}`,
      puzzle1: Math.floor(Math.random() * 600) + 300, // Random time between 300 and 900 seconds
      puzzle2: Math.floor(Math.random() * 600) + 300, // Random time between 300 and 900 seconds
    });
  }

  return mockData;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
