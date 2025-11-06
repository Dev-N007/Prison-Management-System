import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditPrisoner() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!id) return;
    fetch(`/api/prisoners/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name,
          age: data.age,
          gender: data.gender,
          crime: data.crime,
          sentence: data.sentence,
          status: data.status,
          cellId: data.cellId || "",
        });
      });
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    await fetch(`/api/prisoners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        crime: form.crime,
        sentence: form.sentence,
        status: form.status,
        cellId: form.cellId ? Number(form.cellId) : null,
      }),
    });
    router.push("/prisoners");
  }

  return (
    <Layout title="Edit Prisoner">
      <form className="max-w-lg mx-auto space-y-4" onSubmit={submit}>
        <Input
          placeholder="Full Name"
          value={form.name || ""}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Age"
          value={form.age || ""}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />

        <Input
          placeholder="Gender"
          value={form.gender || ""}
          onChange={e => setForm({ ...form, gender: e.target.value })}
        />

        <Input
          placeholder="Crime"
          value={form.crime || ""}
          onChange={e => setForm({ ...form, crime: e.target.value })}
        />

        <Input
          placeholder="Sentence"
          value={form.sentence || ""}
          onChange={e => setForm({ ...form, sentence: e.target.value })}
        />

        <select
          className="border rounded-lg p-2 w-full"
          value={form.status || "Active"}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Released</option>
          <option>Transferred</option>
        </select>

        <Input
          type="number"
          placeholder="Cell ID"
          value={form.cellId || ""}
          onChange={e => setForm({ ...form, cellId: e.target.value })}
        />

        <Button className="w-full">Update</Button>
      </form>
    </Layout>
  );
}
