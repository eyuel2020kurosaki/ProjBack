/**
 * @file        authController.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Contrôleur gérant l'inscription et la connexion des membres du personnel.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const staffModel = require('../models/staffModel');

const SALT_ROUNDS = 10;

/**
 * Inscrit un nouveau membre du personnel.
 *
 * @route   POST /api/auth/register
 * @access  Public
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function register(req, res, next) {
  try {
    const { lastname, firstname, email, password, roles_id } = req.body || {};

    // Validation des champs requis
    if (!lastname || !firstname || !email || !password || roles_id === undefined || roles_id === null) {
      return res.status(400).json({
        status: 'error',
        message: 'Champs requis manquants : lastname, firstname, email, password, roles_id.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const roleId = Number(roles_id);

    if (!Number.isInteger(roleId) || roleId <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Le champ roles_id doit être un entier positif valide.',
      });
    }

    // Vérification de l'unicité de l'email
    const existingStaff = await staffModel.findStaffByEmail(normalizedEmail);
    if (existingStaff) {
      return res.status(409).json({
        status: 'error',
        message: 'Cette adresse email est déjà utilisée.',
      });
    }

    // Vérification de l'existence du rôle référencé
    const validRole = await staffModel.roleExists(roleId);
    if (!validRole) {
      return res.status(400).json({
        status: 'error',
        message: 'Le rôle spécifié (roles_id) est introuvable.',
      });
    }

    // Hachage du mot de passe et insertion en base
    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
    const createdUser = await staffModel.createStaff({
      lastname: String(lastname).trim(),
      firstname: String(firstname).trim(),
      email: normalizedEmail,
      passwordHash,
      roles_id: roleId,
    });

    return res.status(201).json({
      status: 'ok',
      message: 'Membre du personnel enregistré avec succès.',
      user: createdUser,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Authentifie un membre du personnel et renvoie un token JWT.
 *
 * @route   POST /api/auth/login
 * @access  Public
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Champs requis manquants : email et password.',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        status: 'error',
        message: 'Configuration serveur invalide : JWT_SECRET manquant.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await staffModel.findStaffByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      roles_id: user.roles_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    return res.status(200).json({
      status: 'ok',
      token,
      user: {
        id: user.id,
        email: user.email,
        roles_id: user.roles_id,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
};
