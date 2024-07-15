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

const publickey = fs.readFileSync(__dirname + "/src/keys/public.key", "utf8");

router.post("/create/", (req, res) => {
    let { description, dateorder, company, products, total, payment_method, status } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    if (!description || !dateorder || !company || !products || !total || !payment_method || !status) {
        return res.status(400).json({
            message: "Bad request, view documentation for more information",
        });
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const PurchaseOrder = sequelize.models.PurchaseOrder;

    jwt.verify(token, publickey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        PurchaseOrder.create({
            description: description,
            dateorder: dateorder,
            company: company,
            total: total,
            payment_method: payment_method,
            status: status,
            createdBy: decoded.id,
        })
        .then((order) => {
            for (const product of products) {
                order.addProduct(product);
            }
            res.status(200).json({
                message: "Purchase order created",
                order: order,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Internal server error",
            });
        });
    });
});

export default router;
