"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Data = {
  id: number;
  number: string;
  name: string;
  userId: number;
  userName: string;
};

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editName, setEditName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token == "undefined") {
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      fetchData(token);
      fetchUser(token);
    }
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/numbers/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error("Fetch алдаа:", err);
    }
  };
  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`);
      const user = await response.json();
      if (user) {
        setUser(user[0].name);
      }
    } catch (err) {
      console.error("Fetch алдаа:", err);
    }
  };

  const filteredData = data.filter(
    (item) => item.number && item.name.includes(searchTerm)
  );

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    try {
      if (newNumber && newName && token) {
        const newData = { number: newNumber, name: newName, userId: token };
        const response = await fetch("http://localhost:4000/numbers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        });
        if (response.ok) {
          const newData = {
            id: data.length + 1,
            number: newNumber,
            name: newName,
            userId: parseInt(token || "1"),
            userName: "user",
          };
          setData((prev) => [...prev, newData]);
          setNewNumber("");
          setNewName("");
        }
      }
    } catch (err) {
      console.error("Fetch алдаа:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (id) {
        const response = await fetch(`http://localhost:4000/numbers/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setData((prev) => prev.filter((item) => item.id !== id));
        }
      }
    } catch (err) {
      console.error("Fetch алдаа:", err);
    }
  };

  const handleEdit = (id: number, number: string, name: string) => {
    setEditId(id);
    setEditNumber(number);
    setEditName(name);
  };

  const handleSaveEdit = async () => {
    try {
      if (editId !== null) {
        const updatedData = { number: editNumber, name: editName };
        await fetch(`http://localhost:4000/numbers/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
        setData((prev) =>
          prev.map((item) =>
            item.id === editId ? { ...item, ...updatedData } : item
          )
        );
        setEditId(null);
        setEditNumber("");
        setEditName("");
      }
    } catch (error) {
      console.error("Fetch алдаа:", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center mt-48">
      <div className="flex flex-col gap-3">
        <div className="flex">
          <h1 className="font-bold w-[300px]">{user}</h1>
          <button onClick={logOut} className="text-rose-500">
            Log out
          </button>
        </div>
        <Input
          className="h-[30px] rounded-xl"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="Шинэ дугаар"
        />
        <Input
          className="h-[30px] rounded-xl"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Шинэ нэр"
        />
        <Button
          className="h-[30px] rounded-xl bg-green-500 text-white hover:bg-green-700"
          onClick={handleAdd}
        >
          Дугаар нэмэх
        </Button>

        {editId && (
          <div>
            <Input
              className="h-[30px] rounded-xl"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              placeholder="Засах дугаар"
            />
            <Input
              className="h-[30px] rounded-xl mt-3"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Засах нэр"
            />
            <Button
              className="w-full h-[30px] rounded-xl bg-blue-500 text-white hover:bg-blue-700 mt-3"
              onClick={handleSaveEdit}
            >
              Засварлах
            </Button>
          </div>
        )}
        <Input
          className="h-[30px] rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Хайх"
        />
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
              </div>
              <div className="flex flex-row gap-3">
                <Button
                  className="bg-yellow-200 rounded-xl"
                  onClick={() => handleEdit(item.id, item.number, item.name)}
                >
                  <Pencil />
                </Button>
                <Button
                  className="bg-red-400 rounded-xl"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
