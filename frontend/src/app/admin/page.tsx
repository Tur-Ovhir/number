
"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function AdminPage() {
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]); 
  const [editingIndex, setEditingIndex] = useState<number | null>(null); 

  const handleAddOrEditNumber = () => {
    if (phoneNumber) {
      if (editingIndex !== null) {
       
        const updatedNumbers = [...phoneNumbers];
        updatedNumbers[editingIndex] = phoneNumber;
        setPhoneNumbers(updatedNumbers);
        setEditingIndex(null); 
      } else {
       
        setPhoneNumbers([...phoneNumbers, phoneNumber]);
      }
      setPhoneNumber(""); 
    }
  };

  const handleEditClick = (index: number) => {
    setPhoneNumber(phoneNumbers[index]);
    setEditingIndex(index); 
  };

  const handleDeleteClick = (index: number) => {
    const updatedNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedNumbers);
  };

  return (
    <div className="flex justify-center items-center mt-[50px]">
      <div className="flex flex-col gap-3">
        <Link href="/Login">
        <h1 className="text-2xl text-green-500">Sign Out </h1>
        </Link>
        <Input
          className="w-[300px] h-[30px] rounded-xl"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button
          className="w-[300px] h-[30px] rounded-xl hover:bg-blue-500"
          onClick={handleAddOrEditNumber}
        >
          <h3>{editingIndex !== null ? "Засах" : "Дугаар нэмэх"}</h3>
        </Button>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Нэмэгдсэн дугаарууд:</h3>
          <ul className="list-disc pl-5 mt-2">
            {phoneNumbers.map((number, index) => (
              <li key={index} className="flex justify-between">
                <span className="font-bold">{number}</span>
                <div className="flex flex-row gap-3">
                  <Button 
                    className="mr-2 bg-yellow-200 ml-3 h-[30px]"
                    onClick={() => handleEditClick(index)}
                  >
                    Засах
                  </Button>
                  <Button className="mr-2  bg-red-400 h-[30px] " onClick={() => handleDeleteClick(index)}>
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
