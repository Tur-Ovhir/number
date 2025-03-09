"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type Data = {
  id: number;
  number: string;
  name: string;
  userId: number;
  userName: string;
};

export default function AdminPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState<Data[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token == "undefined") {
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      fetchData();
      fetchUser(token);
    }
  }, [router]);

  useEffect(() => {
    fetchAllUserNames();
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/numbers");
      if (response.ok) {
        const numbers = await response.json();
        setData(numbers);
      }
    } catch (error) {
      console.error("Fetch алдаа:", error);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${token}`);
      if (response.ok) {
        const user = await response.json();
        if (user[0]?.role !== "admin") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("User fetch алдаа:", error);
    }
  };

  const fetchAllUserNames = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const uniqueUserIds = Array.from(new Set(data.map((item) => item.userId)));
    const userMap: { [key: number]: string } = {};

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            userMap[userId] = user[0]?.name || "Unknown";
          }
        } catch (error) {
          console.error("User fetch алдаа:", error);
        }
      })
    );

    setUserNames(userMap);
  };

  const groupedData = useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.userId]) acc[item.userId] = [];
      acc[item.userId].push(item);
      return acc;
    }, {} as Record<number, Data[]>);
  }, [data]);

  const handleAddOrEdit = async () => {
    if (editingIndex !== null) {
      try {
        const response = await fetch(
          `http://localhost:4000/numbers/${editingIndex}`,
          {
            method: "PUT",
            body: JSON.stringify({ number: phoneNumber, name }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === editingIndex
                ? { ...item, number: phoneNumber, name }
                : item
            )
          );
          setPhoneNumber("");
          setName("");
          setEditingIndex(null);
        }
      } catch (error) {
        console.error("Fetch алдаа:", error);
      }
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:4000/numbers", {
          method: "POST",
          body: JSON.stringify({ number: phoneNumber, name, userId: token }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const newNumber = {
            id: data.length + 1,
            number: phoneNumber,
            name,
            userId: parseInt(token || "1"),
            userName: "user",
          };
          setData((prevData) => [...prevData, newNumber]);
          setPhoneNumber("");
          setName("");
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
    try {
      const response = await fetch(`http://localhost:4000/numbers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Fetch алдаа:", error);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.number.includes(searchQuery) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="flex justify-center mt-[50px] gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex">
          <h1 className="font-bold text-xl w-[300px]">Админ хэсэг</h1>
          <button onClick={logOut} className="text-rose-500">
            Log out
          </button>
        </div>
        <Input
          className="w-full h-[30px] rounded-xl"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Нэмэх дугаараа оруулна уу!"
        />
        <Input
          className="w-full h-[30px] rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Нэрээ оруулна уу!"
        />
        <Button
          className="w-full h-[30px] rounded-xl hover:bg-white bg-blue-500"
          onClick={handleAddOrEdit}
        >
          <h3>{editingIndex !== null ? "Засах" : "Дугаар нэмэх"}</h3>
        </Button>

        <Input
          className="w-full h-[30px] rounded-xl"
          placeholder="Хайх дугаараа оруулна уу!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="max-h-96 overflow-y-scroll">
          <ul className="space-y-2">
            {filteredData.map((item) => (
              <li
                key={item.id}
                className="flex justify-between p-2 border rounded-xl"
              >
                <div>
                  <p>
                    <strong>Нэр:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Дугаар:</strong> {item.number}
                  </p>
                  <p>
                    <strong>Хэрэглэгч:</strong> {item.userName}
                  </p>
                </div>
                <div className="flex flex-row gap-3">
                  <Button
                    className="bg-yellow-200 rounded-xl"
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    className="bg-red-400 rounded-xl"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-[300px]">
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedData).map(([userId, items]) => (
            <AccordionItem key={userId} value={userId}>
              <AccordionTrigger>
                Хэрэглэгч: {userNames[parseInt(userId)] || "Loading..."}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between p-2 border rounded-xl"
                    >
                      <div>
                        <p>
                          <strong>Нэр:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Дугаар:</strong> {item.number}
                        </p>
                      </div>
                      <div className="flex flex-row gap-3">
                        <Button
                          className="bg-yellow-200 rounded-xl"
                          onClick={() => handleEditClick(item.id)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          className="bg-red-400 rounded-xl"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
