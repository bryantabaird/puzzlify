import Link from "next/link";

export default async function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-40">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to Adventure Quest!</h1>
          <p className="mt-2">Choose your path to begin your adventure.</p>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="card bg-base-300 rounded-box grid flex-1 place-items-center">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Join Existing Adventure
              </h2>
              <p className="mb-6">
                Already have an adventure code? Jump right in and start your
                quest!
              </p>
              <div className="w-full">
                <Link href="/adventure/join">
                  <button className="btn btn-primary w-full">
                    Join Adventure
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="divider lg:divider-horizontal">OR</div>
          <div className="card bg-base-300 rounded-box grid flex-1 place-items-center">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Create an Adventure
              </h2>
              <p className="mb-6">
                Set up a new adventure and challenge your friends!
              </p>
              <div className="w-full">
                <Link href="/adventure/create">
                  <button className="btn btn-secondary w-full">
                    Create Adventure
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
