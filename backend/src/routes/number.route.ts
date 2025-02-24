import { Router } from "express";
import {
  createNumber,
  deleteNumber,
  getNumber,
  getNumbers,
  updateNumber,
} from "../controllers/number.controller";

const numberRouter = Router();

numberRouter.post("/", createNumber);
numberRouter.get("/", getNumbers);
numberRouter.get("/:id", getNumber);
numberRouter.put("/:id", updateNumber);
numberRouter.delete("/:id", deleteNumber);

export default numberRouter;
