import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Dashboard() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStores = async () => {
    try {
      const res = await api.get(`/stores?search=${searchTerm}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Explore Stores</h1>
          
          <div className="w-full max-w-sm">
            <Input 
              placeholder="Search stores by name or address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store: any) => (
            <StoreCard key={store.id} store={store} onRatingSubmit={fetchStores} />
          ))}
          
          {stores.length === 0 && (
             <div className="col-span-full text-center py-10 text-gray-500">
                No stores found matching "{searchTerm}"
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, onRatingSubmit }: { store: any, onRatingSubmit: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const currentRating = watch("score", 5); 

  const onSubmit = async (data: any) => {
    try {
      await api.post("/ratings", { 
        storeId: store.id, 
        score: parseInt(data.score) 
      });
      setIsOpen(false);
      toast.success("Rating submitted!", {
      description: `You gave ${data.score} stars to ${store.name}.`
    });
      onRatingSubmit(); 
    } catch (err) {
      toast.error("Failed to submit rating", {
      description: "Please try again later."
    });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{store.name}</CardTitle>
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm font-bold border border-yellow-200">
            ★ {store.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-sm text-gray-500">{store.address}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600">
          Owned by: <span className="font-medium">{store.owner?.name}</span>
        </p>
      </CardContent>

      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">Rate this Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate {store.name}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex flex-col items-center gap-4">
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("score", star)}
                    className={`text-4xl focus:outline-none transition-transform hover:scale-110 ${
                      star <= currentRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <input type="hidden" {...register("score", { required: true, value: 5 })} />
              
              <p className="text-sm text-gray-500">
                Click a star to rate {currentRating} out of 5
              </p>

              <Button type="submit" className="w-full mt-2">Submit Rating</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}