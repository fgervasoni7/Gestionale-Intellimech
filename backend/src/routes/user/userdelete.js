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

router.delete("/delete", (req, res) => {
    // Get the user from the database
    const { user_id } = req.body;
    if (!user_id) {
        res.status(400).json({
        message: "Bad request, view documentation for more information",
        });
        return;
    }
    const User = sequelize.models.User;

    User.findOne({ where: { id_user: user_id } })
        .then((user) => {
        if (user) {
            user.isdeleted = true;
            user.save();
            res.status(200).json({
            message: "User deleted",
            });
        } else {
            res.status(400).json({
            message: "User does not exist",
            });
        }
        })
        .catch((err) => {
        res.status(500).json({
            message: "Internal server error",
        });
        Logger("error", err);
        });
    });

export default router;