import { Router } from "express";
import fs from "fs";
import { parse, stringify } from "yaml";
import { IData } from "./types";

const router = Router();

router.get("/", async (reg, res) => {
  try {
    const raw = fs.readFileSync(
      "./src/data.yml",
      "utf8"
    );
    const data: IData = parse(raw);
    res
      .status(200)
      .json({ card: data?.card ?? null });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/", async (reg, res) => {
  try {
    const raw = fs.readFileSync(
      "./src/data.yml",
      "utf8"
    );

    const data: IData = parse(raw);
    const card: IData["card"] | undefined =
      reg.body ?? undefined;

    if (
      typeof card?.image_url === "string" &&
      typeof card?.title === "string" &&
      typeof card?.description === "string"
    ) {
      if (data && typeof data === "object") {
        data.card = card;
      }

      fs.writeFileSync(
        "./src/data.yml",
        stringify(data ?? { card })
      );
      res.status(201).json({ message: "Saved" });
    } else {
      res.status(400).json({
        message: "Invalid data type",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
