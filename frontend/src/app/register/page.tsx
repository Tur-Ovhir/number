"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="w-[300px] h-[350px] border flex justify-center items-center flex-col gap-3 mt-40 rounded-xl p-4">
        <h1 className="font-bold text-xl">Бүртгүүлэх</h1>
        <Input
          className="rounded-xl"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="rounded-xl"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="font-bold hover:bg-white bg-blue-500 rounded-xl"
          onClick={handleRegister}
        >
          Бүртгүүлэх
        </Button>
        <Link href="/login">
          <p className="text-gray-600 text-sm">Нэвтрэх</p>
        </Link>
      </div>
    </div>
  );
};
export default Register;
