export default async function Puzzle() {
  return (
    <div className="m-12 flex flex-1 flex-col border-opacity-50 justify-center items-center">
      <div className="card w-1/2 bg-base-300 rounded-box grid h-20 place-items-center">
        Select a Puzzle
      </div>
      <div className="divider">OR</div>
      <button className="w-1/2 btn btn-primary">Create a New Puzzle</button>
    </div>
  );
}
