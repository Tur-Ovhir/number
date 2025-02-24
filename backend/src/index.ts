import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import numberRouter from "./routes/number.route";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/numbers", numberRouter);

app.get("/", (req, res) => {
  res.send({ name: "hello Turuu" });
});

app.listen(port, () => {
  console.log(`Server is running port $ {port}`);
});
