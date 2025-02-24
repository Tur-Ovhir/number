 "use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

 const Login = ()=> {
    return(
        <div className="flex justify-center items-center">
            <div className="w-[300px] h-[350px] border flex justify-center items-center flex-col gap-3 mt-40 rounded-xl">
                <h1 className="font-bold text-xl">Log In</h1>
                <Input className="rounded-xl" placeholder="Username"/>
                <Input className="rounded-xl"placeholder="Password" type="password"/>
                <Button className="font-bold hover:bg-blue-500 rounded-xl">
                    Нэвтрэх
                </Button>
            </div>
        </div>
    )
}
export default  Login;