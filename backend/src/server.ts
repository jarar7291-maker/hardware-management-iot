import express from "express";
import cors from "cors";
import "dotenv/config";


import { pool } from "./config/database";
import computerRoutes from "./routes/computerRoutes.ts";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/computers", computerRoutes);

app.get("/", (req, res) => {
  res.send("Hardware Management & IoT Backend is Running!");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_user"
    );

    res.json({
      success: true,
      message: "Database connection successful",
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});