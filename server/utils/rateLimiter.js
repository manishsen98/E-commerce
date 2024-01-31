import rateLimiter from "express-rate-limit";
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

export default apiLimiter;
