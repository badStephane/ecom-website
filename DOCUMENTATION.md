# 📚 Documentation Complète - LIVEWEAR

## 📖 Table des Matières
1. [Présentation du Projet](#-présentation-du-projet)
2. [Architecture Technique](#-architecture-technique)
3. [Installation et Configuration](#-installation-et-configuration)
4. [Guide d'Utilisation](#-guide-dutilisation)
5. [API Documentation](#-api-documentation)
6. [Sécurité](#-sécurité)
7. [Déploiement](#-déploiement)
8. [Dépannage](#-dépannage)
9. [Contribution](#-contribution)

## 🏆 Présentation du Projet

LIVEWEAR est une plateforme e-commerce moderne offrant une expérience d'achat fluide et sécurisée. Le projet est développé avec une architecture full-stack JavaScript.

### Fonctionnalités Principales
- **Pour les clients** :
  - Parcours de produits par catégories
  - Panier d'achat
  - Passer commande
  - Suivi des commandes
  - Gestion du profil utilisateur

- **Pour les administrateurs** :
  - Tableau de bord complet
  - Gestion des produits et catégories
  - Gestion des commandes
  - Gestion des utilisateurs
  - Statistiques de vente

## 🏗️ Architecture Technique

### Stack Technique
- **Frontend** : React 18, Redux Toolkit, Tailwind CSS
- **Backend** : Node.js, Express
- **Base de données** : MongoDB avec Mongoose
- **Stockage** : Cloudinary pour les images
- **Authentification** : JWT avec rafraîchissement de token

### Structure des Répertoires
```
livewear/
├── frontend/           # Application React
├── server/             # API Node.js/Express
│   ├── config/         # Configuration
│   ├── controllers/    # Logique métier
│   ├── middleware/     # Middleware personnalisés
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Définition des routes
│   └── utils/          # Utilitaires
└── docs/              # Documentation supplémentaire
```

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)
- Compte Cloudinary (pour le stockage des images)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_DEPOT]
   cd livewear
   ```

2. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configurer les variables d'environnement dans .env
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Configurer les variables d'environnement dans .env
   npm run dev
   ```

### Variables d'Environnement

**Backend (server/.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
REFRESH_TOKEN_SECRET=votre_refresh_token_secret
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (frontend/.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=votre_cle_stripe_publique
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXX-X
```

## 👨‍💻 Guide d'Utilisation

### Pour les Utilisateurs
1. **Créer un compte**
   - Remplissez le formulaire d'inscription
   - Vérifiez votre email (si activé)
   
2. **Parcourir les produits**
   - Filtrez par catégories
   - Utilisez la barre de recherche
   
3. **Passer commande**
   - Ajoutez des articles au panier
   - Passez à la caisse
   - Choisissez un mode de paiement
   
### Pour les Administrateurs
1. **Se connecter**
   - Accédez à `/admin/login`
   - Utilisez vos identifiants administrateur
   
2. **Gérer les produits**
   - Ajoutez de nouveaux produits
   - Modifiez les produits existants
   - Gérez les stocks et les prix
   
3. **Suivi des commandes**
   - Consultez les nouvelles commandes
   - Mettez à jour le statut des commandes
   - Gérez les retours et remboursements

## 🌐 API Documentation

### Authentification
Toutes les requêtes nécessitent un jeton JWT valide dans l'en-tête `Authorization`.

```http
Authorization: Bearer votre_jwt_ici
```

### Endpoints Principaux

#### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Mettre à jour un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

#### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/myorders` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id/pay` - Payer une commande
- `PUT /api/orders/:id/deliver` - Marquer comme livrée (admin)

#### Utilisateurs
- `POST /api/users` - S'inscrire
- `POST /api/users/login` - Se connecter
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil

## 🔒 Sécurité

### Mesures de Sécurité Implémentées
- Authentification JWT avec rafraîchissement de token
- Protection contre les attaques CSRF
- Rate limiting
- Validation des entrées utilisateur
- Protection XSS
- Mots de passe hachés avec bcrypt
- Headers de sécurité (Helmet)
- CORS configuré

### Bonnes Pratiques
- Ne jamais commettre de secrets dans le code
- Utiliser HTTPS en production
- Mettre à jour régulièrement les dépendances
- Sauvegarder régulièrement la base de données
- Surveiller les logs d'activité

## 🚀 Déploiement

### Préparation
1. Mettre à jour les variables d'environnement pour la production
2. Construire le frontend : `npm run build`
3. Configurer un serveur web (Nginx, Apache) pour servir le frontend
4. Configurer un gestionnaire de processus (PM2, Nodemon) pour le backend

### Hébergement Recommandé
- **Frontend** : Vercel, Netlify ou S3 + CloudFront
- **Backend** : Heroku, Railway, ou VPS
- **Base de données** : MongoDB Atlas
- **Stockage** : Cloudinary ou S3

## 🛠️ Dépannage

### Problèmes Courants

**Le serveur ne démarre pas**
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez les variables d'environnement
- Consultez les logs d'erreur

**Problèmes d'authentification**
- Vérifiez que le jeton JWT est valide
- Assurez-vous que les en-têtes d'autorisation sont correctement définis
- Vérifiez les dates d'expiration des tokens

**Problèmes de base de données**
- Vérifiez la connexion à MongoDB
- Vérifiez les permissions de l'utilisateur de la base de données
- Vérifiez les logs de la base de données

## 🤝 Contribution

### Comment Contribuer
1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité : `git checkout -b feature/nouvelle-fonctionnalite`
3. Committez vos changements : `git commit -m 'Ajout d'une nouvelle fonctionnalité'`
4. Poussez vers la branche : `git push origin feature/nouvelle-fonctionnalite`
5. Créez une Pull Request

### Convention de Commit
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Mise en forme, point-virgule manquant, etc.
- `refactor:` Refactoring du code
- `test:` Ajout ou modification de tests
- `chore:` Mise à jour des tâches de construction, configuration du gestionnaire de paquets, etc.

### Code de Conduite
- Soyez respectueux envers les autres contributeurs
- Restez professionnel dans vos communications
- Les contributions doivent suivre les directives de style du projet

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙋 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt ou contacter l'équipe de développement à support@livewear.com.
