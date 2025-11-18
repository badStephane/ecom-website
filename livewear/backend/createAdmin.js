import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/livewear';

/**
 * Crée un utilisateur administrateur
 * Usage: node createAdmin.js
 */
async function createAdminUser() {
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupération des variables d'environnement
    const adminEmail = process.env.ADMIN_EMAIL || 'stephane.badiane.dev@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminPhone = process.env.ADMIN_PHONE || '+221000000000';

    // Validation du mot de passe
    if (!adminPassword) {
      console.error('❌ ERREUR: La variable ADMIN_PASSWORD est requise dans .env');
      console.error('💡 Ajoutez: ADMIN_PASSWORD=VotreMotDePasseSecurise123!');
      process.exit(1);
    }

    if (adminPassword.length < 8) {
      console.error('❌ ERREUR: Le mot de passe doit contenir au moins 8 caractères');
      process.exit(1);
    }

    // Vérifier si l'admin existe déjà
    console.log(`🔍 Vérification de l'existence de ${adminEmail}...`);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('\n⚠️  Un utilisateur avec cet email existe déjà!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`👤 Nom: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`🔐 Rôle: ${existingAdmin.role}`);
      console.log(`📊 Statut: ${existingAdmin.isActive ? 'Actif' : 'Inactif'}`);
      
      // Proposer une mise à jour
      if (existingAdmin.role !== 'admin') {
        console.log('\n💡 Cet utilisateur n\'est pas admin. Souhaitez-vous le promouvoir?');
        console.log('   Exécutez: node promoteToAdmin.js');
      }
      
      return;
    }

    // Créer l'utilisateur admin
    console.log('\n🔄 Création de l\'utilisateur administrateur...');
    
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Livewear',
      email: adminEmail,
      password: adminPassword, // Le middleware pre('save') va le hacher
      phone: adminPhone,
      address: 'Dakar, Sénégal',
      role: 'admin',
      isActive: true,
      emailVerified: true // Admin pré-vérifié
    });

    // Sauvegarder (le middleware pre('save') hachera automatiquement le mot de passe)
    await adminUser.save();

    console.log('\n✅ Utilisateur administrateur créé avec succès!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 INFORMATIONS DE CONNEXION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔐 Mot de passe: (voir .env - ADMIN_PASSWORD)`);
    console.log(`📱 Téléphone: ${adminPhone}`);
    console.log(`👤 Nom:      Admin Livewear`);
    console.log(`🎭 Rôle:     admin`);
    console.log(`📊 Statut:   Actif`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Configuration terminée! Vous pouvez maintenant vous connecter.');
    console.log('🚀 Démarrez le serveur avec: npm start\n');

  } catch (error) {
    console.error('\n❌ ERREUR lors de la création de l\'admin:', error.message);
    
    // Messages d'erreur spécifiques
    if (error.code === 11000) {
      console.error('💡 Un utilisateur avec cet email existe déjà dans la base de données.');
    } else if (error.name === 'ValidationError') {
      console.error('💡 Erreur de validation:', error.message);
      Object.keys(error.errors).forEach(key => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    } else if (error.name === 'MongoNetworkError') {
      console.error('💡 Impossible de se connecter à MongoDB. Vérifiez que MongoDB est démarré.');
    }
    
    process.exit(1);
  } finally {
    // Fermer la connexion proprement
    await mongoose.connection.close();
    console.log('👋 Connexion MongoDB fermée.');
  }
}

// Gestion des signaux d'interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️  Interruption détectée...');
  await mongoose.connection.close();
  process.exit(0);
});

// Exécution
createAdminUser();