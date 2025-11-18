const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const Subscriber = require('../models/Subscriber');
// const { sendConfirmationEmail } = require('../services/emailService');

// Rate limiting : 3 inscriptions par IP par heure
const subscribeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3,
  message: { message: 'Trop de tentatives. Réessayez dans une heure.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation renforcée
const validateSubscription = [
  body('email')
    .trim()
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email trop long')
    .custom((value) => {
      // Blocage des emails jetables courants
      const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
      const domain = value.split('@')[1];
      if (disposableDomains.includes(domain)) {
        throw new Error('Les emails jetables ne sont pas autorisés');
      }
      return true;
    })
];

// S'abonner à la newsletter
router.post('/subscribe', 
  subscribeRateLimit,
  validateSubscription,
  async (req, res) => {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array().map(err => err.msg)
        });
      }

      const { email } = req.body;

      // Vérifier si l'email existe déjà
      const existingSubscriber = await Subscriber.findOne({ email });
      
      if (existingSubscriber) {
        // Ne pas révéler si l'email existe (sécurité)
        if (existingSubscriber.isConfirmed) {
          return res.status(200).json({ 
            success: true,
            message: 'Si cet email n\'est pas déjà inscrit, vous recevrez un email de confirmation.' 
          });
        } else {
          // Renvoyer l'email de confirmation
          // await sendConfirmationEmail(email, existingSubscriber.confirmationToken);
          return res.status(200).json({ 
            success: true,
            message: 'Un email de confirmation vous a été envoyé.' 
          });
        }
      }

      // Générer un token de confirmation
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      // Créer le nouvel abonné
      const subscriber = new Subscriber({ 
        email,
        confirmationToken,
        tokenExpiry,
        isConfirmed: false,
        subscribedAt: new Date()
      });

      await subscriber.save();

      // Envoyer l'email de confirmation
      // const confirmationUrl = `${process.env.BASE_URL}/newsletter/confirm/${confirmationToken}`;
      // await sendConfirmationEmail(email, confirmationUrl);

      res.status(201).json({ 
        success: true,
        message: 'Merci ! Un email de confirmation vous a été envoyé.' 
      });

    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.code === 11000) {
        // Erreur de clé dupliquée (MongoDB)
        return res.status(200).json({ 
          success: true,
          message: 'Si cet email n\'est pas déjà inscrit, vous recevrez un email de confirmation.' 
        });
      }

      // Log sécurisé (ne pas exposer les détails)
      console.error('Erreur inscription newsletter:', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });

      res.status(500).json({ 
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
      });
    }
  }
);

// Confirmer l'inscription
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOne({ 
      confirmationToken: token,
      tokenExpiry: { $gt: new Date() }
    });

    if (!subscriber) {
      return res.status(400).json({ 
        success: false,
        message: 'Lien de confirmation invalide ou expiré.' 
      });
    }

    // Activer l'abonnement
    subscriber.isConfirmed = true;
    subscriber.confirmationToken = undefined;
    subscriber.tokenExpiry = undefined;
    subscriber.confirmedAt = new Date();
    
    await subscriber.save();

    res.status(200).json({ 
      success: true,
      message: 'Votre inscription est confirmée ! Merci de votre confiance.' 
    });

  } catch (error) {
    console.error('Erreur confirmation newsletter:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de la confirmation.' 
    });
  }
});

// Se désabonner
router.post('/unsubscribe', 
  [body('email').trim().isEmail().normalizeEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Email invalide' 
        });
      }

      const { email } = req.body;
      
      await Subscriber.findOneAndUpdate(
        { email },
        { 
          isActive: false,
          unsubscribedAt: new Date()
        }
      );

      // Ne pas révéler si l'email existe
      res.status(200).json({ 
        success: true,
        message: 'Vous avez été désabonné avec succès.' 
      });

    } catch (error) {
      console.error('Erreur désinscription newsletter:', error.message);
      res.status(500).json({ 
        success: false,
        message: 'Une erreur est survenue.' 
      });
    }
  }
);

module.exports = router;