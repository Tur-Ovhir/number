import { eq } from "drizzle-orm";
import db from "../database/";
import { users } from "../database/schema";
import { RequestHandler } from "express";

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await db
      .insert(users)
      .values({ name, password, role: "user" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await db.select().from(users).where(eq(users.name, name));

    if (user.length === 0 || user[0].password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)));

    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
