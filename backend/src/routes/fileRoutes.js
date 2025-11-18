import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Fonction utilitaire pour déterminer le type MIME
function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.txt': 'text/plain',
        '.csv': 'text/csv',
        '.json': 'application/json',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.7z': 'application/x-7z-compressed',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip',
        '.bz2': 'application/x-bzip2',
        '.xz': 'application/x-xz',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.odt': 'application/vnd.oasis.opendocument.text',
        '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
        '.odp': 'application/vnd.oasis.opendocument.presentation',
        '.odg': 'application/vnd.oasis.opendocument.graphics',
        '.odc': 'application/vnd.oasis.opendocument.chart',
        '.odf': 'application/vnd.oasis.opendocument.formula',
        '.odi': 'application/vnd.oasis.opendocument.image',
        '.odm': 'application/vnd.oasis.opendocument.text-master',
        '.ott': 'application/vnd.oasis.opendocument.text-template',
        '.ots': 'application/vnd.oasis.opendocument.spreadsheet-template',
        '.otp': 'application/vnd.oasis.opendocument.presentation-template',
        '.otg': 'application/vnd.oasis.opendocument.graphics-template',
        '.otc': 'application/vnd.oasis.opendocument.chart-template',
        '.otf': 'application/vnd.oasis.opendocument.formula-template',
        '.oti': 'application/vnd.oasis.opendocument.image-template',
        '.oth': 'application/vnd.oasis.opendocument.text-web'
    };
    return types[ext] || 'application/octet-stream';
}

/**
 * @route   GET /api/files/:filename
 * @desc    Récupérer un fichier uploadé
 * @access  Privé (authentification requise)
 */
router.get('/:filename', authMiddleware, async (req, res) => {
    try {
        const safeFilename = path.normalize(req.params.filename).replace(/^(\/|\\)/, '');
        const file = path.join(process.cwd(), '..', 'private_uploads', safeFilename);
        
        // Vérifier que le chemin est valide et sécurisé
        if (!file.startsWith(path.join(process.cwd(), '..', 'private_uploads'))) {
            return res.status(400).json({
                success: false,
                message: 'Chemin de fichier invalide'
            });
        }

        // Vérifier que le fichier existe
        try {
            await fs.access(file);
        } catch {
            return res.status(404).json({
                success: false,
                message: 'Fichier non trouvé'
            });
        }

        // Obtenir les statistiques du fichier pour le Content-Length
        const stats = await fs.stat(file);
        
        // Définir les en-têtes de réponse
        const contentType = getContentType(safeFilename);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(safeFilename)}"`);
        
        // En-têtes de sécurité
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        
        // Cache control (1 an pour les images, 1 heure pour le reste)
        const isImage = contentType.startsWith('image/');
        res.setHeader('Cache-Control', `public, max-age=${isImage ? 31536000 : 3600}`);
        
        // Envoyer le fichier en streaming
        const fileStream = fs.createReadStream(file);
        fileStream.pipe(res);
        
        // Gestion des erreurs de streaming
        fileStream.on('error', (error) => {
            console.error('Erreur lors de l\'envoi du fichier:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la lecture du fichier'
                });
            }
        });

    } catch (error) {
        console.error('Erreur de récupération du fichier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du fichier',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
