"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { AccordionContent } from "@/components/ui/accordion";
import { Pencil, Trash2 } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type Data = {
  id: number;
  number: string;
  name: string;
  userId: number;
  userName: string;
};

const User = () => {
  const [isUserSectionVisible, setIsUserSectionVisible] = useState(false);
  const [groupedData, setGroupedData] = useState<Record<number, Data[]>>({});
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  const [editingItem, setEditingItem] = useState<Data | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/numbers");
      if (response.ok) {
        const numbers = await response.json();
        const grouped = numbers.reduce((acc: Record<number, Data[]>, item: Data) => {
          if (!acc[item.userId]) acc[item.userId] = [];
          acc[item.userId].push(item);
          return acc;
        }, {});
        setGroupedData(grouped);
        fetchUserNames(grouped);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserNames = async (groupedData: Record<number, Data[]>) => {
    const userIds = Object.keys(groupedData);
    const userMap: { [key: number]: string } = {};

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            userMap[parseInt(userId)] = user[0]?.name || "Unknown";
          }
        } catch (error) {
          console.error("Error fetching user names:", error);
        }
      })
    );

    setUserNames(userMap);
  };

  const handleEditClick = (item: Data) => {
    setEditingItem(item);
    setPhoneNumber(item.number);
    setName(item.name);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/numbers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGroupedData((prevData) => {
          const updatedData = { ...prevData };
          for (const userId in updatedData) {
            updatedData[userId] = updatedData[userId].filter((item) => item.id !== id);
          }
          return updatedData;
        });
      }
    } catch (error) {
      console.error("Error deleting number:", error);
    }
  };

  const handleUpdateClick = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/numbers/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          number: phoneNumber,
          name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setGroupedData((prevData) => {
          const updatedData = { ...prevData };
          for (const userId in updatedData) {
            updatedData[userId] = updatedData[userId].map((item) =>
              item.id === id ? { ...item, number: phoneNumber, name } : item
            );
          }
          return updatedData;
        });
        setEditingItem(null);
        setPhoneNumber("");
        setName("");
      }
    } catch (error) {
      console.error("Error updating number:", error);
    }
  };


  const filterItems = (items: Data[]) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.number.includes(searchQuery)
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md mt-8">
        <Link href="/admin">
          <Button className="bg-green-400 rounded-xl">
            <IoMdArrowRoundBack /> Буцах
          </Button>
        </Link>
        <Link href="/User">
          <Button
            onClick={() => setIsUserSectionVisible((prev) => !prev)}
            className="p-3 w-full bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition mb-4 mt-3"
          >
            {isUserSectionVisible ? "Хэрэглэгчдийг нуух" : "Хэрэглэгчдийг харуулах"}
          </Button>
        </Link>

        {/* Search Input */}
        <Input
          className="p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Хайх дугаараа оруулна уу!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Accordion */}
        {isUserSectionVisible && (
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedData).map(([userId, items]) => (
              <AccordionItem key={userId} value={userId}>
                <AccordionTrigger className="border border-gray-300 rounded-xl bg-green-400 hover:bg-white flex mt-3 font-bold">
                  Хэрэглэгч: {userNames[parseInt(userId)] || "Loading..."}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 p-4">
                    {filterItems(items).map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between p-3 border rounded-xl shadow-md hover:shadow-lg transition"
                      >
                        <div>
                          <p>
                            <strong>Нэр:</strong>{" "}
                            {editingItem?.id === item.id ? (
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded-md p-1"
                              />
                            ) : (
                              item.name
                            )}
                          </p>
                          <p>
                            <strong>Дугаар:</strong>{" "}
                            {editingItem?.id === item.id ? (
                              <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="border rounded-md p-1"
                              />
                            ) : (
                              item.number
                            )}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="bg-yellow-200 rounded-xl p-2 hover:bg-yellow-300 transition"
                            onClick={() => handleEditClick(item)}
                          >
                            <Pencil />
                          </Button>
                          {editingItem?.id === item.id && (
                            <Button
                              className="bg-blue-500 rounded-xl p-2 hover:bg-blue-600 transition"
                              onClick={() => handleUpdateClick(item.id)}
                            >
                              Save
                            </Button>
                          )}
                          <Button
                            className="bg-red-400 rounded-xl p-2 hover:bg-red-500 transition"
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
        )}
      </div>
    </div>
  );
};

export default User;
