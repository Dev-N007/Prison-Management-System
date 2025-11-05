import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddStaff() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    role: "",
    shift: "",
  });

  async function submit(e: any) {
    e.preventDefault();
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/staff");
  }

  return (
    <Layout title="Add Staff Member">
      <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
        <Input placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <Input placeholder="Shift"
          value={form.shift}
          onChange={(e) => setForm({ ...form, shift: e.target.value })}
        />
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Staff
        </Button>
      </form>
    </Layout>
  );
}
