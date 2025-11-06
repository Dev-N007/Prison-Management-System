import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function DeletePrisoner() {
  const router = useRouter();
  const { id } = router.query;

  async function remove() {
    await fetch(`/api/prisoners/${id}`, { method: "DELETE" });
    router.push("/prisoners");
  }

  return (
    <Layout title="Delete Confirmation">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">
          Are you sure you want to delete this prisoner?
        </p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={remove}>
          Confirm Delete
        </Button>
      </div>
    </Layout>
  );
}
