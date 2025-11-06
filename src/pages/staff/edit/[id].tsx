import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditStaff() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetch(`/api/staff/${id}`).then(r => r.json()).then(setForm);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    await fetch(`/api/staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/staff");
  }

  return (
    <Layout title="Edit Staff">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Role" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} />
        <Input placeholder="Shift" value={form.shift || ""} onChange={e => setForm({ ...form, shift: e.target.value })} />
        <Button className="w-full">Update</Button>
      </form>
    </Layout>
  );
}
