export interface Comment {
  id: string;
  reviewId: string;
  commenterName: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  coverUrl: string;
  description: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookWithReviews extends Book {
  reviews: Review[];
}

export type SortOption = "newest" | "rating" | "reviews" | "az";

export interface BookFilters {
  search?: string;
  genre?: string;
  author?: string;
  minRating?: number;
  sort?: SortOption;
}

export interface BookFormValues {
  title: string;
  author: string;
  genre: string;
  publicationYear: number | "";
  coverUrl: string;
  description: string;
}

export interface CommentFormValues {
  commenterName: string;
  content: string;
}

export interface ReviewFormValues {
  reviewerName: string;
  title: string;
  rating: number;
  content: string;
}
