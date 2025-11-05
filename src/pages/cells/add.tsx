import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCell() {
  const router = useRouter();
  const [blockName, setBlock] = useState("");
  const [capacity, setCapacity] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/cells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockName, capacity: Number(capacity) }),
    });
    router.push("/cells");
  }

  return (
    <Layout title="Add Cell">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Block Name"
          value={blockName}
          onChange={(e) => setBlock(e.target.value)}
        />
        <Input type="number" placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Cell
        </Button>
      </form>
    </Layout>
  );
}
