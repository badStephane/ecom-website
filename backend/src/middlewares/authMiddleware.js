import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT and attach user to request
export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Récupération du token
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Veuillez vous connecter pour accéder à cette ressource" 
      });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupération de l'utilisateur
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "L'utilisateur associé à ce token n'existe plus" 
      });
    }

    // Vérification si le mot de passe a été changé après l'émission du token
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({ 
          success: false,
          message: "Le mot de passe a été modifié. Veuillez vous reconnecter." 
        });
      }
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    next();
  } catch (error) {
    let message = "Session expirée ou invalide. Veuillez vous reconnecter.";
    if (error.name === 'JsonWebTokenError') {
      message = "Token invalide. Veuillez vous reconnecter.";
    } else if (error.name === 'TokenExpiredError') {
      message = "Votre session a expiré. Veuillez vous reconnecter.";
    }
    res.status(401).json({ success: false, message });
  }
};

// Check if user is admin
export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Non autorisé" 
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false,
      message: "Accès réservé aux administrateurs" 
    });
  }

  next();
};

// Optional auth middleware (doesn't require token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from DB
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
