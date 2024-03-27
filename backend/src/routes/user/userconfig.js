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
import { HomeIcon, ShoppingCartIcon, ArchiveBoxIcon, FolderIcon, DocumentDuplicateIcon, ChartPieIcon, UsersIcon, TagIcon, CheckBadgeIcon, ClockIcon, CalendarDaysIcon, DocumentTextIcon, Squares2X2Icon, BanknotesIcon } from '@heroicons/react/24/outline';

const __dirname = path.resolve();

// Setup the express router
const router = express.Router();

// write a function to generate the password
const generatePassword = () => {
    const length = 24,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = [];
    for (let i = 0; i < length; ++i) {
        retVal.push(charset.charAt(Math.floor(Math.random() * charset.length)));
    }
    return retVal.join("");
};

const userNavigation = [
    { name: 'Your profile', href: '/profile' },
    { name: 'Sign out', onClick: () => logout()},
  ]

const fullnavigation = [
    { 
      showedname: "Dashboard", 
      options: [
        { name: 'Dashboard', href: '/homepage', icon: 'HomeIcon', current: false, grant: 'dashboard' },
        { name: 'Rendicontazione', href: '/reporting', icon: 'ClockIcon', current: false, grant: 'calendar' },
        { name: 'Calendario', href: '/calendar', icon: 'CalendarDaysIcon', current: false, grant: 'projects' },
      ], 
    },
    {
      showedname: "Analitycs",
      options: [
        { name: 'Report', href: '/report', icon: 'ChartPieIcon', current: false, grant: 'report' },
      ],
    },
    { 
      showedname: "Project Orders", 
      options: [
        { name: 'Offerte', href: '/offer', icon: 'DocumentTextIcon', current: false, grant: 'offerte' },
        { name: 'Commesse', href: '/orders', icon: 'Squares2X2Icon', current: false, grant: 'commesse' },
        { name: 'Archivio Commesse', href: '/orders/archive', icon: 'ArchiveBoxIcon', current: false, grant: 'archiviocommesse' },
      ], 
    },
    { 
      showedname: "Costs", 
      options: [
        { name: 'Acquisti', href: '#', icon: 'ShoppingCartIcon', current: false, grant: 'acquisti' },
        { name: 'Fatture', href: '/invoices', icon: 'DocumentDuplicateIcon', current: false, grant: 'fatture'}
      ], 
    },
    { 
      showedname: "Registry", 
      options: [
        { name: 'Centri di Costo', href: '#', icon: 'BanknotesIcon', current: false, grant: 'costi' },
        { name: 'Fornitori', href: '/suppliers', icon: 'FolderIcon', current: false, grant: 'fornitori' },
        { name: 'Clienti', href: '/clients', icon: 'UsersIcon', current: false, grant: 'clienti' },
        { name: 'Persone', href: '/people', icon: 'DocumentDuplicateIcon', current: false, grant: 'prodotti' },
      ], 
    },
    { 
      showedname: "Management", 
      options: [
        { name: 'Users', href: '/users', icon: 'UsersIcon', current: false, grant: 'users' },
        { name: 'Role', href: '/roles', icon: 'TagIcon' , current: false, grant: 'role' },
        { name: 'Grant', href: '/grants', icon: 'CheckBadgeIcon', current: false, grant: 'grant' },
      ], 
    },
  ];


router.get("/config", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1] || "";
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

    const User = sequelize.models.User;
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
                        attributes: ["id_grant", "name", "endpoint"],
                    },
                ],
            },
            {
                model: sequelize.models.Group,
                attributes: ["id_group", "name", "Color", "LogoFilename"],
            }
        ],
    });

    if (!user || !user.isActive) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    
    // pick only the grants of the user
    const grants = user.Role.Grants.map((grant) => grant.endpoint);

    let userNavigation = [];

    fullnavigation.forEach((nav) => {
        let options = [];
        nav.options.forEach((option) => {
            if (grants.includes(option.href)) {
                options.push(option);
            }
        });
        if (options.length > 0) {
            userNavigation.push({showedname: nav.showedname, options: options});
        }
    });

    // Send the navigation
    return res.status(200).json({
      color: user.Group.Color,  
      logo: user.Group.LogoFileName || user.Group.name.toLowerCase() + ".svg",
      userNavigation: userNavigation,
    });
} catch (error) {
    Logger("error", error, req, "auth");
    return res.status(401).json({
        message: "Unauthorized",
    });
}
});

export default router;