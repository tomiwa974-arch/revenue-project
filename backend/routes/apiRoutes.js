import express from "express";

const router = express.Router();

let people = []; // same in-memory array shared with admin

router.get("/people", (req, res) => res.json(people));

export default router;
