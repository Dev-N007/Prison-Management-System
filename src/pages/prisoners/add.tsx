import { useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPrisoner() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    crime: "",
    sentence: "",
    status: "Active",
    cellId: "",
  });

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/prisoners", {
      method: "POST",
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
    <Layout title="Add Prisoner">
      <form className="max-w-lg mx-auto space-y-4" onSubmit={submit}>
        <Input
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />

        <Input
          placeholder="Gender"
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value })}
        />

        <Input
          placeholder="Crime"
          value={form.crime}
          onChange={e => setForm({ ...form, crime: e.target.value })}
        />

        <Input
          placeholder="Sentence (e.g., 2 Years)"
          value={form.sentence}
          onChange={e => setForm({ ...form, sentence: e.target.value })}
        />

        {/* ✅ Status Dropdown */}
        <select
          className="border rounded-lg p-2 w-full"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Released</option>
          <option>Transferred</option>
        </select>

        <Input
          type="number"
          placeholder="Cell ID (optional)"
          value={form.cellId}
          onChange={e => setForm({ ...form, cellId: e.target.value })}
        />

        <Button className="w-full">Save Prisoner</Button>
      </form>
    </Layout>
  );
}
