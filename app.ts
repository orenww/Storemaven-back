import express, { Request, Response } from "express";
var cors = require("cors");
import Data from "./src/data";

const app = express();
app.use(cors());
app.use(express.json());


const port = 3001;
const data = new Data();

app.get("/api/v1/users", async (req: Request, res: Response) => {
  let result = await data.getSortedData();
  res.json(result);
});

app.post("/api/v1/users", (req: Request, res: Response) => {
  if (req && req.body) {
    try {
      data.updateStatus(req.body);
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(404).send("Missing data");
  }
});

app.get("/*", (req: Request, res: Response) => {
  res.json({ message: "Helo from server. general" });
});

app.listen(port, () => {
  console.log(`application is running on port ${port}.`);
});
