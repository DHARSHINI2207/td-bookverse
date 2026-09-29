import { requireAuth, requireAdmin } from "../middleware/auth";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiError } from "../utils/ApiError";
import { withRatingStats } from "../utils/ratings";

export const booksRouter = Router();

const bookInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  author: z.string().trim().min(1, "Author is required").max(150),
  genre: z.string().trim().min(1, "Genre is required").max(80),
  publicationYear: z
    .number()
    .int("Publication year must be a whole number")
    .gte(1000, "Publication year looks invalid")
    .lte(new Date().getFullYear() + 1, "Publication year can't be in the future"),
  coverUrl: z.string().trim().url("Cover URL must be a valid URL"),
  description: z.string().trim().min(1, "Description is required").max(4000),
});

const bookQuerySchema = z.object({
  search: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  author: z.string().trim().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["newest", "rating", "reviews", "az"]).optional().default("newest"),
});

// GET /api/books — list with search, filter, sort. Rating/review-count are computed, so
// filtering + sorting by them happens in-memory after the DB fetch.
booksRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = bookQuerySchema.parse(req.query);

    const books = await prisma.book.findMany({
      where: {
        AND: [
          query.search
            ? {
                OR: [
                  { title: { contains: query.search, mode: "insensitive" } },
                  { author: { contains: query.search, mode: "insensitive" } },
                  { genre: { contains: query.search, mode: "insensitive" } },
                ],
              }
            : {},
          query.genre ? { genre: { equals: query.genre, mode: "insensitive" } } : {},
          query.author ? { author: { equals: query.author, mode: "insensitive" } } : {},
        ],
      },
      include: { reviews: { select: { rating: true } } },
      orderBy: query.sort === "az" ? { title: "asc" } : { createdAt: "desc" },
    });

    let result = books.map(withRatingStats);

    if (query.minRating !== undefined) {
      result = result.filter((b) => b.averageRating >= query.minRating!);
    }

    if (query.sort === "rating") {
      result = [...result].sort((a, b) => b.averageRating - a.averageRating);
    } else if (query.sort === "reviews") {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    res.json({
      data: result.map(({ reviews, ...b }) => b),
      meta: { count: result.length },
    });
  })
);

// GET /api/books/:id — single book, with its reviews (newest first).
booksRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
      include: { reviews: { orderBy: { createdAt: "desc" } } },
    });

    if (!book) throw ApiError.notFound("Book not found");

    res.json({ data: withRatingStats(book) });
  })
);

// POST /api/books — create.
booksRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = bookInputSchema.parse(req.body);
    const book = await prisma.book.create({ data });
    res.status(201).json({ data: withRatingStats({ ...book, reviews: [] }) });
  })
);

// PUT /api/books/:id — update.
booksRouter.put(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = bookInputSchema.partial().parse(req.body);

    const exists = await prisma.book.findUnique({ where: { id: req.params.id } });
    if (!exists) throw ApiError.notFound("Book not found");

    const book = await prisma.book.update({
      where: { id: req.params.id },
      data,
      include: { reviews: { select: { rating: true } } },
    });
    res.json({ data: withRatingStats(book) });
  })
);

