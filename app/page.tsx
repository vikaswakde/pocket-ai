import PocketCard from "@/components/pocket-card";
import PageTopMenu from "@/components/pocket-card/components/PageTopMenu";
export default function Home() {
  return (
    <div className="bg-framer-effect flex h-screen flex-col items-center justify-center">
      <PageTopMenu />
      <PocketCard />
    </div>
  );
}
