'use strict';

/**
 * // Valida si un usuario existe en el servicio de autenticación
 * @param {string} userId // ID del usuario a validar
 * @param {string} authServiceUrl // URL del servicio de autenticación
 * @returns {Promise<boolean>} // True si el usuario existe, False en caso contrario
 */
export const validateUserExists = async (userId, authServiceUrl = 'http://localhost:3005') => {
    try {
        if (!userId || typeof userId !== 'string') {
            console.warn('userId inválido:', userId);
            return false;
        }

        // Crear un AbortController para manejar timeouts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

        try {
            const response = await fetch(
                `${authServiceUrl}/api/v1/users/${userId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            // Si la respuesta es 200, el usuario existe
            if (response.status === 200) {
                return true;
            }

            // Si la respuesta es 404, el usuario no existe
            if (response.status === 404) {
                console.warn(`Usuario no encontrado en Auth-Service: ${userId}`);
                return false;
            }

            // Para otros códigos de error, consideramos que hay un problema
            console.warn(`Auth Service respondió con status ${response.status} para usuario ${userId}`);
            return false;

        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error(`Timeout al conectar con Auth-Service para validar usuario ${userId}`);
            } else {
                console.error(`Error de red al validar usuario ${userId}:`, fetchError.message);
            }
            return false;
        }

    } catch (error) {
        console.error('Error inesperado al validar usuario en Auth-Service:', error.message);
        // En caso de error, retornamos false para ser seguro
        return false;
    }
};
