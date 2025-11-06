import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditCell() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ blockName: "", capacity: "" });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cells/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          blockName: data.blockName || "",
          capacity: data.capacity || "",
        });
      });
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();

    await fetch(`/api/cells/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blockName: form.blockName,       // ✅ correct
        capacity: Number(form.capacity),
      }),
    });

    router.push("/cells");
  }

  return (
    <Layout title="Edit Cell">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input
          placeholder="Block Name"
          value={form.blockName}
          onChange={e => setForm({ ...form, blockName: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={e => setForm({ ...form, capacity: e.target.value })}
        />
        <Button className="w-full">Update</Button>
      </form>
    </Layout>
  );
}
