"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Data = {
  id: number;
  number: string;
  name: string;
};

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Хайлт хийх үг

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/numbers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  // Хайлт хийх функц
  const filteredData = data.filter((item) =>
    item.number.includes(searchTerm) // Дугаараар шүүх
  );

  return (
    <div className="flex justify-center items-center mt-48">
      <div className="flex flex-col gap-3">
        {/* Хайлтын утга хадгалах Input */}
        <Input
          className="w-[300px] h-[30px] rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Хайлт хийх үгийг өөрчлөх
          placeholder="Дугаар оруулна уу"
        />
        <Button className="w-[300px] h-[30px] rounded-xl bg-black text-white hover:bg-gray-700">
          Нэр, дугаараар хайх
        </Button>

        {/* Хайлтын үр дүнг харуулах */}
        {filteredData.map((item) => (
          <div key={item.id} className="space-x-4">
            <span>{item.number}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
