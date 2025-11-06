import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditCase() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetch(`/api/cases/${id}`).then(r => r.json()).then(setForm);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    await fetch(`/api/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/cases");
  }

  return (
    <Layout title="Edit Case">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Title" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Status" value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })} />
        <Input type="date" value={form.hearing_date ? form.hearing_date.substring(0,10) : ""} onChange={e => setForm({ ...form, hearing_date: e.target.value })} />
        <Input type="number" placeholder="Prisoner ID" value={form.prisoner_id || ""} onChange={e => setForm({ ...form, prisoner_id: e.target.value })} />
        <Button className="w-full">Update</Button>
      </form>
    </Layout>
  );
}
