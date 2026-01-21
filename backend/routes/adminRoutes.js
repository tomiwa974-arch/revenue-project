import express from "express";
import {
  adminLogin,
  getPeople,
  addPerson,
  updatePerson,
  deletePerson,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

// CRUD routes
router.get("/people", getPeople);
router.post("/people", addPerson);
router.put("/people/:id", updatePerson);
router.delete("/people/:id", deletePerson);

export default router;




 