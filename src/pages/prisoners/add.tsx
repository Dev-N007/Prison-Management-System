import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
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
  });

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/prisoners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/prisoners");
  }

  return (
    <Layout title="Add Prisoner">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input type="number" placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <Input placeholder="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />
        <Input placeholder="Crime"
          value={form.crime}
          onChange={(e) => setForm({ ...form, crime: e.target.value })}
        />
        <Input placeholder="Sentence Duration"
          value={form.sentence}
          onChange={(e) => setForm({ ...form, sentence: e.target.value })}
        />

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Prisoner
        </Button>
      </form>
    </Layout>
  );
}
