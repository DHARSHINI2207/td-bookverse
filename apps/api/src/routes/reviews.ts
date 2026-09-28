import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiError } from "../utils/ApiError";

// mergeParams lets this router read :bookId when mounted under /api/books/:bookId/reviews
export const reviewsRouter = Router({ mergeParams: true });

// A second router for the flat /api/reviews/:id update & delete endpoints.
export const reviewByIdRouter = Router();

const reviewInputSchema = z.object({
  reviewerName: z.string().trim().min(1, "Reviewer name is required").max(100),
  title: z.string().trim().min(1, "Review title is required").max(150),
  rating: z.number().int().min(1, "Rating is required").max(5, "Rating must be 1-5"),
  content: z.string().trim().min(1, "Review content is required").max(3000),
});

// GET /api/books/:bookId/reviews
reviewsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const book = await prisma.book.findUnique({ where: { id: req.params.bookId } });
    if (!book) throw ApiError.notFound("Book not found");

    const reviews = await prisma.review.findMany({
      where: { bookId: req.params.bookId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: reviews });
  })
);

// POST /api/books/:bookId/reviews
reviewsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const book = await prisma.book.findUnique({ where: { id: req.params.bookId } });
    if (!book) throw ApiError.notFound("Book not found");

    const data = reviewInputSchema.parse(req.body);
    const review = await prisma.review.create({
      data: { ...data, bookId: req.params.bookId },
    });
    res.status(201).json({ data: review });
  })
);

// PUT /api/reviews/:id
reviewByIdRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = reviewInputSchema.partial().parse(req.body);

    const exists = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!exists) throw ApiError.notFound("Review not found");

    const review = await prisma.review.update({ where: { id: req.params.id }, data });
    res.json({ data: review });
  })
);

// DELETE /api/reviews/:id
reviewByIdRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const exists = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!exists) throw ApiError.notFound("Review not found");

    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);
