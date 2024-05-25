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
      .json({ settings: data?.settings ?? null });
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
    const regBody: { code: string } | undefined =
      reg.body ?? undefined;

    if (typeof regBody?.code === "string") {
      if (data && typeof data === "object") {
        data.settings = regBody.code;
      }
      fs.writeFileSync(
        "./src/data.yml",
        stringify(
          data ?? { settings: regBody.code }
        )
      );
      res.status(201).json({ message: "Saved" });
    } else {
      res.status(400).json({
        message:
          "Type of settings must be string",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
