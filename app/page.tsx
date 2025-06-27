import PocketCard from "@/components/PocketCard";
import { ModeToggle } from "@/components/mode-toggle";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-black/90">
      <div className="absolute top-0 right-0 p-4">
        <ModeToggle />
      </div>
      <PocketCard />
    </div>
  );
}
