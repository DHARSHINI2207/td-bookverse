import type { Review } from "@prisma/client";

/** Derive averageRating + reviewCount from a book's reviews. Never stored — always computed. */
export function withRatingStats<T extends { reviews?: Pick<Review, "rating">[] }>(
  book: T
): T & { averageRating: number; reviewCount: number } {
  const reviews = book.reviews ?? [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10;

  return { ...book, averageRating, reviewCount };
}
