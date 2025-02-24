
"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Data = {
  id: number;
  number: string;
  name: string;
};

export default function AdminPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState<Data[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    const fetchUser = async () => {
      const response = await fetch(`http://localhost:4000/users/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data[0].role !== "admin") {
          router.push("/login");
        }
      }
    };

    fetchData();
    fetchUser();
  }, [router]);

  const handleAddOrEdit = async () => {
    if (editingIndex !== null) {
     
      try {
        const response = await fetch(`http://localhost:4000/numbers/${editingIndex}`, {
          method: "PUT",
          body: JSON.stringify({ number: phoneNumber, name }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const updatedData = data.map((item) =>
            item.id === editingIndex ? { ...item, number: phoneNumber, name } : item
          );
          setData(updatedData);
          setPhoneNumber("");
          setName("");
          setEditingIndex(null);
        } else {
          console.error("Алдаа:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch алдаа:", error);
      }
    } else {
      
      try {
        const response = await fetch("http://localhost:4000/numbers", {
          method: "POST",
          body: JSON.stringify({ number: phoneNumber, name }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setPhoneNumber("");
          setName("");
          const newNumber = { id: data.length + 1, number: phoneNumber, name };
          setData([...data, newNumber]);
        } else {
          console.error("Алдаа:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch алдаа:", error);
      }
    }
  };

  const handleEditClick = (id: number) => {
    const numberToEdit = data.find((item) => item.id === id);
    if (numberToEdit) {
      setPhoneNumber(numberToEdit.number);
      setName(numberToEdit.name);
      setEditingIndex(id);
    }
  };

  const handleDeleteClick = async (id: number) => {
    await fetch(`http://localhost:4000/numbers/${id}`, {
      method: "DELETE",
    });
    const updatedNumbers = data.filter((number) => number.id !== id);
    setData(updatedNumbers);
  };

  const filteredData = data.filter(
    (item) =>
      item.number.includes(searchQuery) || item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center mt-[50px]">
      <div className="flex flex-col gap-3">
        <Link href="/Login">
          <h1 className="text-2xl text-green-500">Sign Out </h1>
        </Link>

       
        <Input
          className="w-[300px] h-[30px] rounded-xl"
          placeholder="Хайх дугаараа оруулна уу!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

       
        <Input
          className="w-[300px] h-[30px] rounded-xl"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Нэмэх дугаараа оруулна уу!"
        />
        <Button
          className="w-[300px] h-[30px] rounded-xl hover:bg-blue-500"
          onClick={handleAddOrEdit}
        >
          <h3>{editingIndex !== null ? "Засах" : "Дугаар нэмэх"}</h3>
        </Button>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Нэмэгдсэн дугаарууд:</h3>
          <ul className="list-disc pl-5 mt-2">
            {filteredData.map((number) => (
              <li key={number.id} className="flex justify-between">
                <span className="font-bold">{number.number}</span>
                <span className="font-bold">{number.name}</span>
                <div className="flex flex-row gap-3">
                  <Button
                    className="mr-2 bg-yellow-200 ml-3 h-[30px]"
                    onClick={() => handleEditClick(number.id)}
                  >
                    Засах
                  </Button>
                  <Button
                    className="mr-2 bg-red-400 h-[30px]"
                    onClick={() => handleDeleteClick(number.id)}
                  >
                    Устгах
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
