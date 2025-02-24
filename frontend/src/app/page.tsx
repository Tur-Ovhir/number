'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";


export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000");
        const result = await response.json();
        setData(result.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex justify-center items-center mt-48">
      <div className="flex flex-col gap-3">
        <Input
          className="w-[300px] h-[30px] rounded-xl"
        />
        <Button
          className="w-[300px] h-[30px] rounded-xl bg-black text-white hover:bg-gray-700"
        >
          Нэр, дугаараар хайх
        </Button>
          {data}
      </div>
    </div>
  );
}
