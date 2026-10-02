import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'geoshield_super_secret_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'geoshield_refresh_secret_key_2026';
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

/**
 * Hash plain text password using bcryptjs
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Generate Access Token and Refresh Token for a user
 */
export function generateTokens(user) {
    const payload = {
        userId: user.id,
        tenantId: user.tenant_id || user.tenantId || 1,
        email: user.email,
        role: user.role || 'ANALYST',
        permissions: user.permissions || []
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
    const refreshToken = jwt.sign({ userId: user.id, tenantId: payload.tenantId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

    return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL };
}

/**
 * Middleware: Express JWT Authentication
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Authentication Required',
            code: 'UNAUTHORIZED',
            message: 'No authorization token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.tenantId = decoded.tenantId;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token Expired',
                code: 'TOKEN_EXPIRED',
                message: 'Access token has expired. Please refresh token.'
            });
        }
        return res.status(403).json({
            error: 'Invalid Token',
            code: 'FORBIDDEN',
            message: 'Token verification failed'
        });
    }
}

/**
 * Middleware: Role-Based Access Control (RBAC)
 */
export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
            return res.status(403).json({
                error: 'Access Denied',
                code: 'INSUFFICIENT_PERMISSIONS',
                message: `User role '${userRole}' is not permitted to access this resource`
            });
        }
        next();
    };
}

/**
 * Middleware: Tenant Isolation
 * Ensures request has tenant context or defaults to header / public tenant
 */
export function tenantIsolation(req, res, next) {
    const tenantHeader = req.headers['x-tenant-id'];
    if (req.user && req.user.tenantId) {
        req.tenantId = req.user.tenantId;
    } else if (tenantHeader) {
        req.tenantId = parseInt(tenantHeader, 10);
    } else {
        req.tenantId = 1; // Default Tenant
    }
    next();
}
