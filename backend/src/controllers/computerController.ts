import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.ts";

export const getComputers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  

    const result = await pool.query(
      "SELECT * FROM computer ORDER BY id ASC"
    );

    res.json({
      success: true,
      computers: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createComputer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      hostname,
      ipAddress,
      location,
      macAddress,
      ownerId,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO computer
      ("name", "hostname", "ipAddress", "location", "macAddress", "ownerId", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        name,
        hostname ?? null,
        ipAddress ?? null,
        location ?? null,
        macAddress ?? null,
        ownerId ?? null,
        new Date(),
      ]
    );

    res.status(201).json({
      success: true,
      computer: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create computer",
    });
  }
};

export const updateComputer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      name,
      hostname,
      ipAddress,
      location,
      macAddress,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE computer
       SET
         "name" = $1,
         "hostname" = $2,
         "ipAddress" = $3,
         "location" = $4,
         "macAddress" = $5,
         "status" = $6,
         "updatedAt" = $7
       WHERE "id" = $8
       RETURNING *`,
      [
        name,
        hostname ?? null,
        ipAddress ?? null,
        location ?? null,
        macAddress ?? null,
        status ?? "online",
        new Date(),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Computer not found",
      });
    }

    res.json({
      success: true,
      computer: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update computer",
    });
  }
};