"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";  

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data[0]?.role === "admin") {
        localStorage.setItem("token", data[0].id);
        router.push("/admin");
      } else {
        localStorage.setItem("token", data[0]?.id);
        router.push("/");
      }
    } catch (err) {
      console.error("Fetch алдаа:", err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[300px] h-[350px] border flex justify-center items-center flex-col gap-3 mt-40 rounded-xl p-4 bg-green-600">
        <h1 className="font-bold text-xl">Нэвтрэх</h1>
        <Input
          className="rounded-xl bg-gray-100"
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
            {showPassword ?  <FaEye /> :<FaEyeSlash /> } 
          </button>
        </div>
        <Button
          className="font-bold hover:bg-white bg-gray-100 rounded-xl text-black"
          onClick={handleLogin}
        >
          Нэвтрэх
        </Button>
        <Link href="/register">
          <Button className="font-bold text-sm rounded-xl bg-gray-100 hover:bg-white">Бүртгүүлэх</Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
