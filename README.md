# PetREST - API de Gestion pour un Refuge pour Animaux
 
API RESTful développée dans le cadre du **Projet Backend** au CPNV (Sainte-Croix).
 
Ce projet vise à fournir un backend complet et sécurisé permettant de gérer l'accueil d'animaux au sein d'un refuge, le contrôle des capacités d'hébergement, le suivi du personnel et le traitement des dossiers d'adoption.
 
 **Statut actuel du projet :** Semaine 1 - Initialisation du projet, cadrage fonctionnel et validation du cahier des charges.
 
## Équipe de Développement (Binôme SI-CA2a)
 
* **Taveeporn Matta** :
 
  * Responsable des entités `staff` (Comptes & Authentification JWT) et `enclosures` (Gestion des enclos / hébergement).
 
* **Eyuel Worku** :
 
  * Responsable des entités `animals` (Gestion des animaux accueillis) et `adoptions` (Dossiers de candidature).
 
## Stack Technique Retenue
 
* **Environnement d'exécution :** Node.js
 
* **Framework Web :** Express.js
 
* **Base de Données :** MySQL (driver `mysql2/promise`)
 
* **Sécurité :** Authentification par jeton (JWT) et hachage des mots de passe (`bcrypt`)
 
* **Gestion de Projet :** Méthodologie Agile via **GitHub Projects**
 
* **Outil de Test :** Postman
 
## Organisation Prévisionnelle du Répertoire
 
```

PetREST/

├── docs/                 # Livrables PDF (Cahier des charges, MCD, MLD, Journal de bord)

├── sql/                  # Scripts SQL de création et de test (Semaine 3)

├── src/                  # Code source de l'API Node.js / Express (Semaines 4 à 7)

├── tests/                # Collection Postman (Semaine 7)

├── .env.example          # Gabarit des variables d'environnement

├── .gitignore

├── package.json

└── README.md
 
```
 
## Calendrier des Livrables & Avancement
 
| Livrable | Support | Échéance | Statut | 

| ----- | ----- | ----- | ----- | 

| **Cahier des charges** | PDF (Teams) | Semaine 1 | En cours de finalisation | 

| **MCD & Lien GitHub** | PDF & URL (Teams) | Semaine 2 | Planifié | 

| **MLD** | PDF (Teams) | Semaine 3 | Planifié | 

| **Release v1.0 (API testable)** | GitHub Release | Semaine 8 | Planifié |
 
