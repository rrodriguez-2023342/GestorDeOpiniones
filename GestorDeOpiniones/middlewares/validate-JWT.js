import jwt from 'jsonwebtoken';

// Middleware para validar el token JWT
export const validateJWT = (req, res, next) => {
    // Configuracion del JWT usand las variables de entorno
    const jwtConfig = {
        secret: process.env.JWT_SECRET,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    }
    // Verificamos que exista la clave secreta
    if (!jwtConfig.secret){
        console.error('Error de validación JWT: JWT_SECRET no está definido');
        return res.status(500).json({
            success: false,
            message: 'Configuración del servidor inválida: falta JWT_SECRET'
        })
    }
    // Intentamos obtener el token desde los headers
    const token = 
        req.header('x-token') ||
        req.header('Authorization')?.replace('Bearer ', '');
    // Si no se envio token, devolvemos el error con el el mensaje
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó un token',
            error: 'MISSING_TOKEN'
        })
    }

    try {
        const verifyOptions = {};
        if(jwtConfig.issuer) verifyOptions.issuer = jwtConfig.issuer;
        if(jwtConfig.audience) verifyOptions.audience = jwtConfig.audience;
        // Verificamos el token usando la clave secreta
        const decoded = jwt.verify(token, jwtConfig.secret, verifyOptions);
        // Si el token no trae rol, mostramos advertencia
        if(!decoded.role){
            console.warn(
                `Token sin campo 'role' para usuario ${decoded.sub}. Payload:`,
                JSON.stringify(decoded, null, 2)
            )
        }
        // Guardamos los datos del usuario en la request
        req.user = {
            id: decoded.sub, //userID del servicio de autenticación
            jti: decoded.jti, //ID único del token
            iat: decoded.iat, // Emitido en
            role: decoded.role || 'USER_ROLE'
        }

        next();

    } catch (error) {
        console.error(`Error validando JWT: ${error.message}`);
        //Si el token expiro
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
                error: 'TOKEN_EXPIRED'
            })
        }
        //Si el token es invalido
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'INVALID_TOKEN'
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Error al validar el token',
            error: error.message
        })
    }
}