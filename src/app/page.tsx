"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCreateClan = () => {
    router.push("/clans/create");
  };

  return (
    <Container className="py-[85px]">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-bold text-[36px]">Explore</h1>
        <Button onClick={handleCreateClan}>Create Clan</Button>
      </div>
    </Container>
  );
}
