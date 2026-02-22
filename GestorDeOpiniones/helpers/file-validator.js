import path from 'path';
import { randomBytes } from 'crypto';

//Validar imagenes antes de subirlas
export class FileValidator {
    static ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
    static MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    //Extensiones permitidas
    static ALLOWED_CONTENT_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ];
    //Metodo para validar la imagen
    static validateImage(file) {
        //Verificar que exista y no este vacio
        if (!file || file.size === 0) {
        return { isValid: false, errorMessage: 'File is required' };
        }

        // Validar tamaño
        if (file.size > this.MAX_FILE_SIZE_BYTES) {
        return {
            isValid: false,
            errorMessage: `File size cannot exceed ${this.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
        };
        }

        // Validar extensión
        const extension = path.extname(file.originalname).toLowerCase();
        if (!this.ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
        return {
            isValid: false,
            errorMessage: `Only the following file types are allowed: ${this.ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
        };
        }

        // Validar content type
        if (!this.ALLOWED_CONTENT_TYPES.includes(file.mimetype.toLowerCase())) {
        return { isValid: false, errorMessage: 'Invalid file type' };
        }

        return { isValid: true };
    }
    //Generar el nombre del archivo
    static generateSecureFileName(originalFileName) {
        //Obtenemos la extension original
        const extension = path.extname(originalFileName).toLowerCase();
        const uniqueId = randomBytes(6).toString('hex'); // 12 caracteres únicos
        return `profile-${uniqueId}${extension}`;
    }

    //Sanitizar el nombre
    static sanitizeFileName(fileName) {
        //Quitamos espacios, reemplazamos espacios y guiones por _, y lo convertimos en minusculas
        return fileName.trim().replace(/ /g, '_').replace(/-/g, '_').toLowerCase();
    }
}
//Exportamos la clase
export default FileValidator;
