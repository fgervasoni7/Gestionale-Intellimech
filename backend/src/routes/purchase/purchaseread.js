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

router.get("/read/", async (req, res) => {
    try {
        // Get the purchase orders from the database
        const PurchaseOrder = sequelize.models.PurchaseOrder;

        const purchaseOrders = await PurchaseOrder.findAll({
            include: [
                {
                    model: sequelize.models.Company,
                    attributes: ["id_company", "name"],
                },
                { model: sequelize.models.User, as: 'createdByUser', attributes: ['id_user', 'name', 'surname'] },
                { model: sequelize.models.User, as: 'updatedByUser', attributes: ['id_user', 'name', 'surname'] },
                { model: sequelize.models.User, as: 'deletedByUser', attributes: ['id_user', 'name', 'surname'] }    
            ],
        });

        for (let order of purchaseOrders) {
            const creationDate = new Date(order.updatedAt); // Assuming order.updatedAt is a valid date string or a Date object
            const deadlineDate = new Date(creationDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Adding 30 days to the creation date
            const currentDate = new Date(); // Get current date

            // Calculate remaining days
            const timeDifference = deadlineDate.getTime() - currentDate.getTime();
            const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // if remaining days is less than 0, set status to "Expired"
            if (remainingDays < 0) {
                order.status = "Expired";
            }            

            // Save the changes
            await order.save();

            // Create a new field in the object
            order.dataValues.deadlineDate = deadlineDate;
        }

        res.status(200).json({ 
            message: "Purchase orders found",
            purchaseOrders: purchaseOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Purchase orders not found",
            error: error
        });
    }
});

export default router;
