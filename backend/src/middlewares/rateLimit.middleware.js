/**
 * Middlewares de Rate Limiting - VacunApp MX
 * Protege rutas sensibles contra fuerza bruta y abuso (spam de correos).
 */

import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP en la ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Demasiados intentos. Intenta de nuevo en unos minutos.",
  },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // más estricto: solo 3 solicitudes de correo por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Demasiadas solicitudes de recuperación. Intenta de nuevo más tarde.",
  },
});
