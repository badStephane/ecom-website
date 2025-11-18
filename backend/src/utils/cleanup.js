import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'private_uploads');
const MAX_AGE_DAYS = 7; // Supprimer les fichiers plus vieux que 7 jours
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 heures

/**
 * Nettoie les fichiers plus anciens que MAX_AGE_DAYS
 */
export async function cleanupOldFiles() {
    try {
        const files = await fs.readdir(UPLOAD_DIR);
        const now = new Date();
        let deletedCount = 0;
        let errorCount = 0;
        
        console.log(`[Cleanup] Début du nettoyage du répertoire: ${UPLOAD_DIR}`);
        
        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file);
            
            try {
                const stats = await fs.stat(filePath);
                
                // Ignorer les dossiers
                if (stats.isDirectory()) {
                    continue;
                }
                
                const fileAgeInDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
                
                if (fileAgeInDays > MAX_AGE_DAYS) {
                    await fs.unlink(filePath);
                    console.log(`[Cleanup] Fichier supprimé (${Math.round(fileAgeInDays)} jours): ${file}`);
                    deletedCount++;
                }
            } catch (error) {
                console.error(`[Cleanup] Erreur avec le fichier ${file}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`[Cleanup] Nettoyage terminé. ${deletedCount} fichiers supprimés, ${errorCount} erreurs.`);
        return { success: true, deletedCount, errorCount };
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`[Cleanup] Le répertoire ${UPLOAD_DIR} n'existe pas.`);
        } else {
            console.error('[Cleanup] Erreur lors du nettoyage:', error);
        }
        return { success: false, error: error.message };
    }
}

/**
 * Planifie le nettoyage automatique
 */
let cleanupInterval;

export function startCleanupScheduler() {
    // Nettoyage immédiat au démarrage
    cleanupOldFiles().catch(console.error);
    
    // Planifier le nettoyage périodique
    cleanupInterval = setInterval(() => {
        cleanupOldFiles().catch(console.error);
    }, CLEANUP_INTERVAL);
    
    console.log(`[Cleanup] Nettoyage automatique planifié toutes les 24 heures`);
    return cleanupInterval;
}

export function stopCleanupScheduler() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        console.log('[Cleanup] Nettoyage automatique arrêté');
    }
}

// Si ce fichier est exécuté directement (et non importé)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log('Exécution du nettoyage manuel...');
    cleanupOldFiles()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Erreur lors du nettoyage manuel:', error);
            process.exit(1);
        });
}
