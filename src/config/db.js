/**
 * @file        db.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Configuration du pool de connexions MySQL (mysql2/promise)
 *              à partir des variables d'environnement (.env) et
 *              vérification de la connexion à la base de données.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Variables d'environnement obligatoires pour se connecter à la base
const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_USER', 'DB_NAME'];

const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingVars.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missingVars.join(', ')}. ` +
      'Vérifiez votre fichier .env (voir .env.example).'
  );
}

/**
 * Pool de connexions MySQL partagé par toute l'application.
 * Un pool réutilise les connexions ouvertes au lieu d'en créer une
 * nouvelle à chaque requête, ce qui est plus performant.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true, // Met les requêtes en attente si toutes les connexions sont occupées
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0, // 0 = file d'attente illimitée
  charset: 'utf8mb4',
});

/**
 * Vérifie que la base de données est joignable en empruntant
 * une connexion au pool et en envoyant un ping au serveur MySQL.
 *
 * @async
 * @returns {Promise<void>} Résolue si la connexion fonctionne
 * @throws  {Error} Si le serveur MySQL est injoignable ou les identifiants invalides
 */
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log(
      `Connexion MySQL établie (${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME})`
    );
  } catch (err) {
    console.error(`Échec de la connexion à MySQL : ${err.message}`);
    throw err;
  } finally {
    // Toujours rendre la connexion au pool, même en cas d'erreur
    if (connection) connection.release();
  }
}

module.exports = { pool, testConnection };
