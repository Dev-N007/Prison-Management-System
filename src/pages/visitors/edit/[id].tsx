import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditVisitor() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetch(`/api/visitors/${id}`).then(r => r.json()).then(setForm);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    await fetch(`/api/visitors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/visitors");
  }

  return (
    <Layout title="Edit Visitor">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Relation" value={form.relation || ""} onChange={e => setForm({ ...form, relation: e.target.value })} />
        <Input type="date" value={form.visit_date ? form.visit_date.substring(0,10) : ""} onChange={e => setForm({ ...form, visit_date: e.target.value })} />
        <Input type="number" placeholder="Prisoner ID" value={form.prisoner_id || ""} onChange={e => setForm({ ...form, prisoner_id: e.target.value })} />
        <Button className="w-full">Update</Button>
      </form>
    </Layout>
  );
}
