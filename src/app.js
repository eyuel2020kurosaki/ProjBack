/**
 * @file        app.js
 * @project     PetREST
 * @author      Taveeporn Matta / Eyuel Worku
 * @created     25.11.2026
 * @modified    25.11.2026
 * @version     1.0
 * @description Point d'entrée et configuration principale du serveur Express.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

/**
 * @route   GET /ping
 * @desc    Vérifie que le serveur API répond correctement
 * @access  Public
 */
app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'pong',
  });
});

// Routes de l'API
app.use('/api/auth', authRoutes);

// Gestion des routes inexistantes (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route introuvable',
  });
});

// Gestion centralisée des erreurs serveur (aucun bug bloquant)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erreur interne du serveur',
  });
});

// Démarrage du serveur uniquement si ce fichier est exécuté directement.
// La connexion MySQL est vérifiée avant d'écouter les requêtes.
if (require.main === module) {
  const { testConnection } = require('./config/db');

  testConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur PetREST démarré sur http://localhost:${PORT}`);
      });
    })
    .catch(() => {
      console.error('Arrêt du serveur : base de données inaccessible.');
      process.exit(1);
    });
}

module.exports = app;
