import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddVisitor() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    relation: "",
    visitDate: "",
    prisonerId: "",
  });

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, prisonerId: Number(form.prisonerId) }),
    });
    router.push("/visitors");
  }

  return (
    <Layout title="Add Visitor">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Visitor Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input placeholder="Relation"
          value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
        />
        <Input type="date"
          value={form.visitDate}
          onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
        />
        <Input placeholder="Prisoner ID"
          value={form.prisonerId}
          onChange={(e) => setForm({ ...form, prisonerId: e.target.value })}
        />

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Visitor
        </Button>
      </form>
    </Layout>
  );
}
