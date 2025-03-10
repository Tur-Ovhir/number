"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";  

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await fetch("http://localhost:4000/users/register", {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[300px] h-[350px] border flex justify-center items-center flex-col gap-3 mt-40 rounded-xl p-4 bg-green-600">
        <h1 className="font-bold text-xl">Бүртгүүлэх</h1>
        <Input
          className="rounded-xl bg-gray-100 hover:bg-white"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="relative w-full">
          <Input
            className="rounded-xl bg-gray-100 pr-10"  
            placeholder="Password"
            type={showPassword ? "text" : "password"}  
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}  
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ?   <FaEye />: <FaEyeSlash />}  
          </button>
        </div>
        <Button
          className="font-bold hover:bg-white bg-gray-100 rounded-xl"
          onClick={handleRegister}
        >
          Бүртгүүлэх
        </Button>
        <Link href="/login">
          <Button className="bg-gray-100 hover:bg-white rounded-xl font-bold text-sm">
            Нэвтрэх
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
