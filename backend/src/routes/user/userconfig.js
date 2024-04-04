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
        { name: 'Dashboard', href: '/homepage', icon: 'HomeIcon', current: false, permissions: 'dashboard' },
        { name: 'Rendicontazione', href: '/reporting', icon: 'ClockIcon', current: false, permissions: 'calendar' },
        { name: 'Calendario', href: '/calendar', icon: 'CalendarDaysIcon', current: false, permissions: 'projects' },
      ], 
    },
    {
      showedname: "Analitycs",
      options: [
        { name: 'Report', href: '/analitycs', icon: 'ChartPieIcon', current: false, permissions: 'report' },
      ],
    },
    { 
      showedname: "Project Orders", 
      options: [
        { name: 'Offerte', href: '/offer', icon: 'DocumentTextIcon', current: false, permissions: 'offerte' },
        { name: 'Commesse', href: '/project', icon: 'Squares2X2Icon', current: false, permissions: 'commesse' },
        { name: 'Archivio Commesse', href: '/orders/archive', icon: 'ArchiveBoxIcon', current: false, permissions: 'archiviocommesse' },
      ], 
    },
    { 
      showedname: "Costs", 
      options: [
        { name: 'Acquisti', href: '/purchase', icon: 'ShoppingCartIcon', current: false, permissions: 'acquisti' },
      ], 
    },
    {
      showedname: "Fatture",
      options: [
        { name: 'Fatture Attive', href: '/invoices/active', icon: 'DocumentPlusIcon', current: false, },
        { name: 'Fatture Passive', href: '/invoices/passive', icon: 'DocumentMinusIcon', current: false, }
      ],
    },
    { 
      showedname: "Registry", 
      options: [
        { name: 'Fornitori', href: '/company/suppliers', icon: 'FolderIcon', current: false },
        { name: 'Clienti', href: '/company/clients', icon: 'UsersIcon', current: false },
        { name: 'Dipendenti e Consulenti', href: '/employees-consultants', icon: 'DocumentDuplicateIcon', current: false },
      ], 
    },
    { 
      showedname: "Management", 
      options: [
        { name: 'Users', href: '/users', icon: 'UsersIcon', current: false },
        { name: 'Role', href: '/roles', icon: 'TagIcon' , current: false },
        { name: 'Permissions', href: '/permissions', icon: 'CheckBadgeIcon', current: false },
      ], 
    },
  ];
  


//   router.get("/config", async (req, res) => {
//     try {
//         const token = req.headers["authorization"]?.split(" ")[1] || "";
//         if (!token) {
//             return res.status(401).json({
//                 message: "Unauthorized",
//             });
//         }

//         const publicKey = fs.readFileSync(
//             path.resolve(__dirname, "./src/keys/public.key")
//         );

//         const decoded = jwt.verify(token, publicKey, {
//             algorithms: ["RS256"],
//         });

//         const User = sequelize.models.User;
//         const user = await User.findOne({
//             where: { id_user: decoded.id },
//             attributes: ["id_user", "name", "surname", "birthdate", "username", "email", "isDeleted", "isActive", "createdAt", "updatedAt"],
//             include: [
//                 {
//                     model: sequelize.models.Role,
//                     attributes: ["id_role", "name"],
//                     include: [
//                         {
//                             model: sequelize.models.Permission,
//                             attributes: ["id_permission", "description", "route"],
//                         },
//                     ],
//                 },
//                 {
//                     model: sequelize.models.Group,
//                     attributes: ["id_group", "name", "Color", "LogoFilename"],
//                 }
//             ],
//         });

//         if (!user || !user.isActive) {
//             return res.status(401).json({
//                 message: "Unauthorized",
//             });
//         }

//         // pick only the permissions of the user
//         const permissions = user.Role ? [].concat(...user.Role.Permissions.map(permission => permission.endpoint)) : [];

//         let userNavigation = [];

//         fullnavigation.forEach((nav) => {
//             let options = [];
//             nav.options.forEach((option) => {
//                 if (permissions.includes(option.permissions)) {
//                     options.push(option);
//                 }
//             });
//             if (options.length > 0) {
//                 userNavigation.push({ showedname: nav.showedname, options: options });
//             }
//         });

//         // Send the navigation
//         return res.status(200).json({
//             color: user.Group.Color,
//             logo: user.Group.LogoFileName || user.Group.name.toLowerCase() + ".svg",
//             userNavigation: userNavigation,
//         });
//     } catch (error) {
//         Logger("error", error, req, "auth");
//         return res.status(401).json({
//             message: "Unauthorized",
//         });
//     }
// });
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
                          model: sequelize.models.Permission,
                          attributes: ["id_permission", "description", "route"],
                          where: { actionType: "Read" },
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

      // pick only the permissions of the user
      let permissions = user.Role ? [].concat(...user.Role.Permissions.map(permission => permission.route)) : [];
      //filter it by actiontype Read
      let userNavigation = [];

      fullnavigation.forEach((nav) => {
          let options = [];
          nav.options.forEach((option) => {
              if (permissions.includes(option.href)) {
                  options.push(option);
              }
          });
          if (options.length > 0) {
              userNavigation.push({ showedname: nav.showedname, options: options });
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