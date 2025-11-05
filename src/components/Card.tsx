import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardCard({ title, value }: { title: string; value: any }) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="text-gray-500 text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-blue-600">{value}</p>
      </CardContent>
    </Card>
  );
}
