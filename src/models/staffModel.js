/**
 * @file        staffModel.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Modèle d'accès aux données pour les tables `staff` et `roles`.
 */

const { pool } = require('../config/db');

/**
 * Recherche un membre du personnel par son adresse email.
 *
 * @async
 * @param {string} email - Email du membre du personnel
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null
 */
async function findStaffByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, lastname, firstname, email, password, roles_id FROM staff WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * Vérifie si un rôle existe en base de données.
 *
 * @async
 * @param {number} roleId - Identifiant du rôle
 * @returns {Promise<boolean>} true si le rôle existe, false sinon
 */
async function roleExists(roleId) {
  const [rows] = await pool.execute('SELECT id FROM roles WHERE id = ?', [roleId]);
  return rows.length > 0;
}

/**
 * Insère un nouveau membre du personnel en base de données.
 *
 * @async
 * @param {Object} staffData - Données du membre du personnel
 * @param {string} staffData.lastname - Nom de famille
 * @param {string} staffData.firstname - Prénom
 * @param {string} staffData.email - Adresse email unique
 * @param {string} staffData.passwordHash - Mot de passe haché (bcrypt)
 * @param {number} staffData.roles_id - Identifiant du rôle
 * @returns {Promise<Object>} Les informations non sensibles de l'utilisateur créé
 */
async function createStaff({ lastname, firstname, email, passwordHash, roles_id }) {
  const [result] = await pool.execute(
    'INSERT INTO staff (lastname, firstname, email, password, roles_id) VALUES (?, ?, ?, ?, ?)',
    [lastname, firstname, email, passwordHash, roles_id]
  );

  return {
    id: result.insertId,
    lastname,
    firstname,
    email,
    roles_id,
  };
}

module.exports = {
  findStaffByEmail,
  roleExists,
  createStaff,
};
