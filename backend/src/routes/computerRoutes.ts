import express from "express";
import {
  getComputers,
  createComputer,
  updateComputer,
} from "../controllers/computerController.ts";
const router = express.Router();

router.get("/", getComputers);
router.post("/", createComputer);
router.put("/:id", updateComputer);
export default router;