import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function DeleteCell() {
  const router = useRouter();
  const { id } = router.query;

  async function remove() {
    await fetch(`/api/cells/${id}`, { method: "DELETE" });
    router.push("/cells");
  }

  return (
    <Layout title="Delete Cell">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Are you sure you want to delete this cell?</p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={remove}>
          Confirm Delete
        </Button>
      </div>
    </Layout>
  );
}
