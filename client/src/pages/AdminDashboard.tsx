import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="stores">Manage Stores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
          
          <TabsContent value="stores">
            <StoresTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [sortCol, setSortCol] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users?sortBy=${sortCol}&order=${sortOrder}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => { fetchUsers(); }, [sortCol, sortOrder]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortOrder("asc"); }
  };

  return (
    <div className="bg-white rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead> 
            
            <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:bg-slate-100">Name ↕</TableHead>
            <TableHead onClick={() => handleSort("email")} className="cursor-pointer hover:bg-slate-100">Email ↕</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell className="font-bold text-gray-500">{user.id}</TableCell>
              
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="truncate max-w-[200px]">{user.address}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                  user.role === 'STORE_OWNER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.role}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StoresTable() {
  const [stores, setStores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores"); 
      setStores(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStores(); }, []);

  const onCreateStore = async (data: any) => {
    try {
      await api.post("/stores", { 
        ...data, 
        ownerId: parseInt(data.ownerId) 
      }); 
      setIsOpen(false);
      reset();
      fetchStores(); 
     toast.success("Store created successfully!", {
      description: `${data.name} has been added to the database.`
    });
    } catch (err: any) { 
     toast.error("Failed to create store", {
      description: err.response?.data?.error || "Unknown error occurred."
    });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Registered Stores</h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Store</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onCreateStore)} className="grid gap-4 py-4">
              
              <div className="grid gap-2">
                <Label>Store Name</Label>
                <Input {...register("name", { required: true })} placeholder="e.g. Tech World" />
              </div>
              
              <div className="grid gap-2">
                <Label>Store Email</Label>
                <Input {...register("email", { required: true })} placeholder="store@example.com" />
              </div>
              
              <div className="grid gap-2">
                <Label>Address</Label>
                <Input {...register("address", { required: true })} placeholder="123 Street, City" />
              </div>

              <div className="grid gap-2">
                <Label>Owner User ID</Label>
                <Input 
                  type="number" 
                  {...register("ownerId", { required: true })} 
                  placeholder="e.g. 2"
                />
                <p className="text-[10px] text-gray-500">
                  *Check the 'Manage Users' tab to find a User ID. The user must not already own a store.
                </p>
              </div>

              <Button type="submit">Create Store</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store: any) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                     ★ {store.rating.toFixed(1)}
                  </div>
                </TableCell>
                <TableCell>{store.owner?.name || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}