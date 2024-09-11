import AdventureForm2 from "@/components/AdventureForm2";

export default function CreateAdventurePage() {
  return (
    <div className="flex justify-center">
      <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
        <div className="card-body">
          <div className="items-center mt-2">
            <AdventureForm2 />
          </div>
        </div>
      </div>
    </div>
  );
}
