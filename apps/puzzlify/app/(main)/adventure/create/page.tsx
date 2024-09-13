import AdventureForm from "@/components/AdventureForm";

export default function CreateAdventurePage() {
  const now = new Date();

  return (
    <div className="flex justify-center">
      <div className="items-center mt-2 p-8">
        <AdventureForm currentDateTime={now} />
      </div>
    </div>
  );
}
