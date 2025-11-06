import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function DeleteCase() {
  const router = useRouter();
  const { id } = router.query;

  async function remove() {
    await fetch(`/api/cases/${id}`, { method: "DELETE" });
    router.push("/cases");
  }

  return (
    <Layout title="Delete Case">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Delete this case record?</p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={remove}>
          Confirm Delete
        </Button>
      </div>
    </Layout>
  );
}
