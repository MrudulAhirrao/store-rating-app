import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OwnerDashboard() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stores/my-stats");
        setStore(res.data);
      } catch (err) {
        console.error("No store found or error fetching");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading stats...</div>;
  if (!store) return <div className="p-10 text-center">You do not have a store yet. Contact Admin.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Store Owner Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Your Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.name}</div>
              <p className="text-xs text-gray-500">{store.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">★ {store.rating.toFixed(1)} / 5.0</div>
              <p className="text-xs text-gray-500">Based on {store.ratings.length} reviews</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Customer Ratings</h2>
        <div className="bg-white rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rating Given</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.ratings.map((rating: any) => (
                <TableRow key={rating.id}>
                  <TableCell className="font-medium">{rating.user.name}</TableCell>
                  <TableCell>{rating.user.email}</TableCell>
                  <TableCell>
                    <span className="font-bold text-yellow-600">★ {rating.score}</span>
                  </TableCell>
                </TableRow>
              ))}
              {store.ratings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                    No ratings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}