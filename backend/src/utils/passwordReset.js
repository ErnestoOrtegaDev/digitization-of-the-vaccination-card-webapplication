import crypto from "crypto";
import redisClient from "../config/redis.js";

const TOKEN_TTL_SECONDS = 30 * 60;

export async function createResetToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  await redisClient.set(`pwd_reset:${token}`, userId.toString(), {
    EX: TOKEN_TTL_SECONDS,
  });
  return token;
}

export async function consumeResetToken(token) {
  const key = `pwd_reset:${token}`;
  const userId = await redisClient.get(key);
  if (!userId) return null;
  await redisClient.del(key);
  return userId;
}
