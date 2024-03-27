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
import cookieparser from "cookie-parser";
import cookie from "cookie";

 
const router = express.Router();

const __dirname = path.resolve();

router.use(bodyParser.json());
router.use(cors());
router.use(cookieparser());


router.get("/verify", async (req, res) => {
    //verify if token is valid and if user is active or not deleted and return user data and get also the information about role and grants
    try {
        const token = req.headers["authorization"]?.split(" ")[1] || "";
        const User = sequelize.models.User;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const publicKey = fs.readFileSync(
            path.resolve(__dirname, "./src/keys/public.key")
        );

        const decoded = jwt.verify(token, publicKey, {
            algorithms: ["RS256"],
        });

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user = await User.findOne({
            where: { id_user: decoded.id },
            attributes: ["id_user", "name", "surname", "birthdate", "username", "email", "isDeleted", "isActive", "createdAt", "updatedAt"],
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ["id_role", "name"],
                    include: [
                        {
                            model: sequelize.models.Grant,
                            attributes: ["id_grant", "name"],
                        },
                    ],
                },
            ],
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        // Sending the user data without RoleGrant and Grants data
        const userDataWithoutGrants = {
            id_user: user.id_user,
            name: user.name,
            surname: user.surname,
            username: user.username,
            birthdate: user.birthdate,
            email: user.email,
            isDeleted: user.isDeleted,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return res.status(200).json({
            user: user,
        });
    } catch (error) {
        Logger("error", error, null, "auth");
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
});


export default router;
