import express from "express"
import cors from "cors"

const app = express();
const port = 4000;
app.use(cors())

app.get('/', (req,res) => {
    res.send({"name":'hello Turuu'})
})

app.listen(port, () => {
    console.log (`Server is running port $ {port}`);
})