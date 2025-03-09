import { RequestHandler } from "express";
import db from "../database";
import { numbers, users } from "../database/schema";
import { eq } from "drizzle-orm";

export const createNumber: RequestHandler = async (req, res) => {
  const { number, name, userId } = req.body;
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const newNumber = await db
    .insert(numbers)
    .values({ number, name, userId, userName: user.name });
  res.status(201).json(newNumber);
};

export const getNumbers: RequestHandler = async (req, res) => {
  const thisNumbers = await db.query.numbers.findMany();
  res.status(200).json(thisNumbers);
};

export const getNumber: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const number = await db
    .select()
    .from(numbers)
    .where(eq(numbers.id, parseInt(id)));
  res.status(200).json(number);
};

export const getNumberWithUserId: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const number = await db
    .select()
    .from(numbers)
    .where(eq(numbers.userId, parseInt(id)));
  res.status(200).json(number);
};

export const updateNumber: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { number, name } = req.body;
  const updatedNumber = await db
    .update(numbers)
    .set({ number, name })
    .where(eq(numbers.id, parseInt(id)));
  res.status(200).json(updatedNumber);
};

export const deleteNumber: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const deletedNumber = await db
    .delete(numbers)
    .where(eq(numbers.id, parseInt(id)));
  res.status(200).json(deletedNumber);
};
