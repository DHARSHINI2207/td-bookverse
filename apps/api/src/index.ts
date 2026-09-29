import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { authRouter } from "./routes/auth";
import { booksRouter } from "./routes/books";
import { reviewsRouter, reviewByIdRouter } from "./routes/reviews";
import { commentsRouter, commentByIdRouter } from "./routes/comments";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = Number(process.env.PORT || process.env.API_PORT) || 4000;

// --- Security & plumbing -----------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please slow down." },
  })
);

// --- Health check --------------------------------------------------------
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// --- Routes ---------------------------------------------------------------
app.use("/api/auth", authRouter);
app.use("/api/books/:bookId/reviews", reviewsRouter);
app.use("/api/books", booksRouter);
app.use("/api/reviews", reviewByIdRouter);
app.use("/api/reviews/:reviewId/comments", commentsRouter);
app.use("/api/comments", commentByIdRouter);

// --- 404 + error handling ---------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`T&D BookVerse API listening on http://localhost:${PORT}`);
});
