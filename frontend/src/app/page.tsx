
"use client"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";  


type Data = {   
  id: number;   
  number: string;   
  name: string; 
};

export default function Home() {   
  const [data, setData] = useState<Data[]>([]);   
  const [searchTerm, setSearchTerm] = useState("");   
  const [newNumber, setNewNumber] = useState("");   
  const [newName, setNewName] = useState("");   
  const [editId, setEditId] = useState<number | null>(null);   
  const [editNumber, setEditNumber] = useState("");   
  const [editName, setEditName] = useState("");  
  const router = useRouter();

  useEffect(() => {    
    const token = localStorage.getItem("token");

    if (token) {
      fetchData(token);
    }else{
      router.push("/Login");
    }
  }, []);    

  const fetchData = async (userId:string) => {       
    const response = await fetch(`http://localhost:4000/numbers/user/${userId}`, {         
      method: "GET",         
      headers: {           
        "Content-Type": "application/json",         
      },       
    });       
    const data = await response.json();       
    setData(data);     
  };  

  const filteredData = data.filter((item) => item.number && item.name.includes(searchTerm));

  const handleAdd = async () => {
    const token =localStorage.getItem("token")

    if (newNumber && newName && token) {       
      const newData = { number: newNumber, name: newName,userId:token };       
      const response = await fetch("http://localhost:4000/numbers", {         
        method: "POST",         
        headers: {           
          "Content-Type": "application/json",         
        },         
        body: JSON.stringify(newData),       
      });       
      const addedData = await response.json();       
      setData((prev) => [...prev, addedData]);       
      setNewNumber("");       
      setNewName("");     
    }   
  };  

 
  const handleDelete = async (id: number) => {     
    await fetch(`http://localhost:4000/numbers/${id}`, {         
      method: "DELETE",       
    });     
    setData((prev) => prev.filter((item) => item.id !== id));   
  };  


  const handleEdit = (id: number, number: string, name: string) => {     
    setEditId(id);     
    setEditNumber(number);     
    setEditName(name);   
  };  

  const handleSaveEdit = async () => {     
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
        prev.map((item) => (item.id === editId ? { ...item, ...updatedData } : item))     
      );       
      setEditId(null);       
      setEditNumber("");       
      setEditName("");     
    }   
  };    

  return (     
    <div className="flex justify-center items-center mt-48">       
      <div className="flex flex-col gap-3">  
        <h1 className="font-bold">013р анги</h1>         
        <Input           
          className="w-[300px] h-[30px] rounded-xl"           
          value={searchTerm}           
          onChange={(e) => setSearchTerm(e.target.value)}            
          placeholder="Нэр,Дугаар оруулна уу"         
        />         
        <Button 
          className="w-[300px] h-[30px] rounded-xl bg-black text-white hover:bg-gray-700" 
          onClick={handleAdd}
        >           
          Нэр, дугаараар хайх
        </Button>         
    
        <Input 
          className="w-[300px] h-[30px] rounded-xl" 
          value={newNumber} 
          onChange={(e) => setNewNumber(e.target.value)} 
          placeholder="Шинэ дугаар" 
        />
        <Input 
          className="w-[300px] h-[30px] rounded-xl" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="Шинэ нэр" 
        />
        <Button 
          className="w-[300px] h-[30px] rounded-xl bg-green-500 text-white hover:bg-green-700" 
          onClick={handleAdd}
        >           
          Дугаар нэмэх
        </Button>

  
        {editId && (
          <div>
            <Input
              className="w-[300px] h-[30px] rounded-xl"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              placeholder="Засах дугаар"
            />
            <Input
              className="w-[300px] h-[30px] rounded-xl mt-3"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Засах нэр"
            />
            <Button 
              className="w-[300px] h-[30px] rounded-xl bg-blue-500 text-white hover:bg-blue-700 mt-3" 
              onClick={handleSaveEdit}
            >
              Засварлах
            </Button>
          </div>
        )}

     
        {filteredData.map((item) => (           
          <div key={item.id} className="space-x-4 font-bold ">             
            <span>{item.number}</span>             
            <span>{item.name}</span>             
            <Button 
              onClick={() => handleDelete(item.id)} 
              className="text-red-500 hover:text-red-700"
            >
              Устгах
            </Button>
            <Button 
              onClick={() => handleEdit(item.id, item.number, item.name)} 
              className="text-blue-500 hover:text-blue-700"
            >
              Засах
            </Button>
          </div>         
        ))}       
      </div>     
    </div>   
  ); 
}