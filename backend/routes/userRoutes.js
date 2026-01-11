import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const peoplePath = path.resolve("data/people.json");

// Get all people (public)
router.get("/people", (req, res) => {
  if (!fs.existsSync(peoplePath)) fs.writeFileSync(peoplePath, "[]");
  const people = JSON.parse(fs.readFileSync(peoplePath));
  res.json(people);
});

export default router;


