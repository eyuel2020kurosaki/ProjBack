/**
 * @file        authMiddleware.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Middleware Express vérifiant le token JWT dans le header Authorization: Bearer.
 */

const jwt = require('jsonwebtoken');

/**
 * Vérifie la présence et la validité du token JWT dans le header Authorization.
 * Attache le payload décodé à `req.user` si le token est valide.
 * Renvoie 401 Unauthorized si le header est absent, mal formaté ou si le token est invalide/expiré.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token manquant ou format Authorization: Bearer invalide.',
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token manquant.',
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      status: 'error',
      message: 'Configuration serveur invalide : JWT_SECRET manquant.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token expiré.'
        : 'Token invalide.';

    return res.status(401).json({
      status: 'error',
      message,
    });
  }
}

module.exports = authMiddleware;
