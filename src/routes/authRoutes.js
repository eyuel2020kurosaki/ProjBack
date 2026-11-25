/**
 * @file        authRoutes.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Définition des routes d'authentification (/api/auth).
 */

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Inscription d'un membre du personnel
router.post('/register', authController.register);

// POST /api/auth/login - Connexion et génération du token JWT
router.post('/login', authController.login);

module.exports = router;
