import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { encodeId } from "../utils/hashids.js";
import {
  authLimiter,
  passwordResetLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Crea una nueva cuenta de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente
 */
router.post("/register", authLimiter, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión y genera tokens de sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Autenticación exitosa
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario y destruye las cookies de seguridad
 *     tags: [Autenticación]
 *     responses:
 *       '200':
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente
 *       '500':
 *         description: Falla interna del servidor
 */
router.post("/logout", logout);

//Ruta de Prueba para verificar que el token funciona y que el usuario tiene el rol adecuado
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtiene datos del usuario en sesión
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Datos obtenidos correctamente
 */
router.get("/me", verifyToken, (req, res) => {
  const normalizedUser = {
    id: encodeId(req.user.id),
    email: req.user.email,
    role: req.user.role,
  };

  res.status(200).json({
    status: "success",
    message: "¡Tienes acceso a la zona segura!",
    user: normalizedUser,
    userData: {
      ...req.user,
      id: normalizedUser.id,
    },
  });
});

router.post("/refresh", refreshToken);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Solicita el envío de un correo para restablecer la contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Instrucciones enviadas (respuesta genérica exista o no el correo)
 */
router.post("/forgot-password", passwordResetLimiter, forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña usando un token de un solo uso
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Contraseña actualizada correctamente
 *       '400':
 *         description: Token inválido o expirado
 */
router.post("/reset-password", authLimiter, resetPassword);

export default router;
