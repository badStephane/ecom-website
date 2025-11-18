# 🛡️ LIVEWEAR - Plateforme E-commerce Sécurisée

Bienvenue sur la documentation de LIVEWEAR, une plateforme e-commerce moderne et sécurisée.

## 📋 Vue d'ensemble

- **Frontend** : React.js avec Redux
- **Backend** : Node.js avec Express
- **Base de données** : MongoDB
- **Authentification** : JWT avec rafraîchissement de token
- **Sécurité** : Protection avancée contre les attaques courantes

## 🚀 Pour commencer

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_DEPOT]
   cd livewear
   ```

2. **Configurer l'environnement**
   - Créez un fichier `.env` dans le dossier `server/` avec les variables d'environnement nécessaires
   - Consultez `env.example` pour la configuration requise

3. **Installer les dépendances**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Démarrer l'application**
   ```bash
   # Démarrer le serveur (depuis le dossier server/)
   npm run dev
   
   # Démarrer le frontend (depuis le dossier frontend/)
   npm run dev
   ```

## 🔒 Sécurité

Consultez le fichier [SECURITY.md](./SECURITY.md) pour une documentation complète sur les mesures de sécurité mises en place.

## 📚 Documentation technique

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture technique et modèles de données
- **[SUMMARY.md](./SUMMARY.md)** - Fonctionnalités et roadmap
  - Redux store structure
  - Component tree

---

## ✅ Je me prépare au déploiement

**Checklist:**

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✔️
  - Avant production
  - Tests requis
  - Configuration sécurité
  - Performance checks

---

## 📁 Structure du Projet

### Backend
```
/server
├── src/
│   ├── config/         # MongoDB config
│   ├── models/         # Schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Auth, Error handling
│   ├── utils/          # Cloudinary, helpers
│   └── server.js       # Entry point
├── .env                # Configuration
└── package.json
```

### Frontend
```
/react-ecommerce-app
├── src/
│   ├── admin/          # Admin Panel 🆕
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   ├── services/
│   │   └── AdminRouter.jsx
│   ├── components/     # Main app components
│   ├── pages/          # Main app pages
│   ├── store/          # Redux store
│   ├── hooks/
│   └── App.tsx
└── package.json
```

---

## 🎯 Par Cas d'Usage

### Je veux...

**...installer et tester le projet**
→ [QUICK_START.md](./QUICK_START.md)

**...configurer MongoDB**
→ [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) → MongoDB Atlas section

**...configurer Cloudinary**
→ [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) → Cloudinary section

**...comprendre l'architecture**
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

**...connaître les APIs disponibles**
→ [COMPLETE_SETUP.md](./COMPLETE_SETUP.md) → API Endpoints section

**...utiliser l'Admin Panel**
→ [COMPLETE_SETUP.md](./COMPLETE_SETUP.md) → Admin Panel section

**...déployer en production**
→ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**...résoudre un problème**
→ [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) → Erreurs Courantes section

**...contribuer au code**
→ [ARCHITECTURE.md](./ARCHITECTURE.md) → Component Tree / File Structure

---

## 📝 Documents Disponibles

| Document | Durée | Contenu |
|----------|-------|---------|
| QUICK_START.md | 5 min | Démarrage rapide |
| ARCHITECTURE.md | 15 min | Vue d'ensemble visuelle |
| SUMMARY.md | 10 min | Résumé complet |
| INSTALLATION_GUIDE.md | 30 min | Installation détaillée |
| COMPLETE_SETUP.md | 30 min | Configuration complète |
| DEPLOYMENT_CHECKLIST.md | 20 min | Avant production |
| **TOTAL** | **~2h** | **Documentation complète** |

---

## 🔗 Links Utiles

### Services Externes
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Vercel](https://vercel.com/) - Frontend deployment
- [Railway/Render](https://railway.app/) - Backend deployment

### Documentation
- [Node.js Docs](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Redux Docs](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ⚡ Commandes Essentielles

### Backend
```bash
# Installer
npm install

# Développement (avec hot reload)
npm run dev

# Production
npm start

# Tests
npm test
```

### Frontend
```bash
# Installer
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run serve

# Tests
npm test
```

---

## 🎓 Progression Recommandée

```
1. QUICK_START.md
   ↓
2. ARCHITECTURE.md
   ↓
3. SUMMARY.md
   ↓
4. Démarrer backend (npm run dev)
   ↓
5. Démarrer frontend (npm run dev)
   ↓
6. Tester Admin Panel
   ↓
7. INSTALLATION_GUIDE.md (pour les details)
   ↓
8. COMPLETE_SETUP.md (référence)
   ↓
9. Développer & tester
   ↓
10. DEPLOYMENT_CHECKLIST.md
    ↓
11. Déployer! 🚀
```

---

## 🆘 Besoin d'Aide?

### Erreurs Courantes
→ [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#-erreurs-courantes)

### Configuration
→ [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

### API Reference
→ [COMPLETE_SETUP.md](./COMPLETE_SETUP.md#-api-endpoints)

### Architecture
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ✨ À Retenir

✅ **Système complet prêt à l'emploi**
- Backend API REST
- Frontend React e-commerce
- Admin Panel intégré
- Authentication JWT
- MongoDB database

✅ **Production-ready**
- Code modulé
- Error handling
- CORS configured
- Middleware chain

✅ **Scalable**
- Clean architecture
- Redux for state
- Reusable components
- Documented code

---

## 🎉 Bonne Chance!

**Prochaine étape**: Ouvre [QUICK_START.md](./QUICK_START.md) et lance les commandes! 🚀

---

**Créé avec ❤️ pour Livewear**

*Dernière mise à jour: Novembre 2024*
