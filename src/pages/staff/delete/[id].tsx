import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function DeleteStaff() {
  const router = useRouter();
  const { id } = router.query;

  async function remove() {
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    router.push("/staff");
  }

  return (
    <Layout title="Delete Staff">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Are you sure you want to delete this staff member?</p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={remove}>
          Confirm Delete
        </Button>
      </div>
    </Layout>
  );
}
