import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function DeleteVisitor() {
  const router = useRouter();
  const { id } = router.query;

  async function remove() {
    await fetch(`/api/visitors/${id}`, { method: "DELETE" });
    router.push("/visitors");
  }

  return (
    <Layout title="Delete Visitor">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Delete this visitor entry?</p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={remove}>
          Confirm Delete
        </Button>
      </div>
    </Layout>
  );
}
