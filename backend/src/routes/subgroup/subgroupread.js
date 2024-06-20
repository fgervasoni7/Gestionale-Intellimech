import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import sequelize from "../../utils/db.js";
import Logger from "../../utils/logger.js";

// Setup the express router
const router = express.Router();

// __dirname
const __dirname = path.resolve();

router.get("/read/", (req, res) => {
    // Get the role from the database
    const Subgroup = sequelize.models.Subgroup;

    Subgroup.findAll({
        where: {
            isDeleted: false,
        },
    })
    .then((subgroup) => {
        if (subgroup) {
            res.status(200).json({
                message: "Groups found",
                subgroups: subgroup,
            });
        } else {
            res.status(400).json({
                message: "groups do not exist",
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            message: "Internal server error",
        });
    });
});

export default router;