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

router.post("/create", (req, res) => {
    // Get the user from the database
    const { email, username, password, name, surname, id_role } = req.body;
    if (!email || !password || !name || !surname || !id_role) {
        res.status(400).json({
        message: "Bad request, view documentation for more information",
        });
        return;
    }
    const User = sequelize.models.User;
    User.findOne({ where: { email: email } })
        .then((user) => {
        if (user) {
            res.status(400).json({
            message: "User already exists",
            });
        } else {
            // Hash the password
            bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({
                message: "Internal server error",
                });
                Logger("error", err);
            } else {
                // Create the user
                User.create({
                    name: name,
                    surname: surname,
                    birthdate: null,
                    username: username,
                    email: email,
                    password: hash,
                    role: id_role,
                    isdeleted: false,
                    isActive: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    addedBy: null,
                    updatedBy: null,
                })
                .then((user) => {
                    res.status(200).json({
                    message: "User created",
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                    message: "Internal server error",
                    });
                    Logger("error", err);
                });
            }
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