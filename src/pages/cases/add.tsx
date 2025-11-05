import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCase() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    status: "",
    hearingDate: "",
    prisonerId: "",
  });

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, prisonerId: Number(form.prisonerId) }),
    });
    router.push("/cases");
  }

  return (
    <Layout title="Add Case">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Case Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input placeholder="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
        <Input type="date"
          value={form.hearingDate}
          onChange={(e) => setForm({ ...form, hearingDate: e.target.value })}
        />
        <Input placeholder="Prisoner ID"
          value={form.prisonerId}
          onChange={(e) => setForm({ ...form, prisonerId: e.target.value })}
        />

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Case
        </Button>
      </form>
    </Layout>
  );
}
