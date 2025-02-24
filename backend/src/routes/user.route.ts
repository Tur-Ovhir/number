import { Router } from "express";
import { login, getUser, register } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/:id", getUser);

export default userRouter;
