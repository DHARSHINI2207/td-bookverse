import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiError } from "../utils/ApiError";

export const commentsRouter = Router({ mergeParams: true });
export const commentByIdRouter = Router();

const commentSchema = z.object({
  commenterName: z.string().trim().min(1, "Your name is required").max(100),
  content: z.string().trim().min(1, "Comment cannot be empty").max(1000),
});

// GET /api/reviews/:reviewId/comments
commentsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const review = await prisma.review.findUnique({ where: { id: req.params.reviewId } });
    if (!review) throw ApiError.notFound("Review not found");

    const comments = await prisma.comment.findMany({
      where: { reviewId: req.params.reviewId },
      orderBy: { createdAt: "asc" },
    });
    res.json({ data: comments });
  })
);

// POST /api/reviews/:reviewId/comments
commentsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const review = await prisma.review.findUnique({ where: { id: req.params.reviewId } });
    if (!review) throw ApiError.notFound("Review not found");

    const data = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: { ...data, reviewId: req.params.reviewId },
    });
    res.status(201).json({ data: comment });
  })
);

// DELETE /api/comments/:id
commentByIdRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const exists = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!exists) throw ApiError.notFound("Comment not found");
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);
