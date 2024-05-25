import express, {
  Express,
  Request,
  Response,
} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import settingsRouter from "./settings";
import dataRouter from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  bodyParser.urlencoded({ extended: false })
);
app.use(bodyParser.json());

app.use("/settings", settingsRouter);
app.use("/data", dataRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Express + TypeScript Server is running"
  );
});

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  );
});
