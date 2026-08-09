import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "vacunapp_redis"}:6379`,
});

redisClient.on("error", (err) =>
  console.error("[Redis] Error de conexión:", err)
);

export default redisClient;