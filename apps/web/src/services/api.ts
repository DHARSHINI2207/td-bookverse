import axios, { AxiosError } from "axios";
import type {
  Book,
  BookFilters,
  BookFormValues,
  BookWithReviews,
  Comment,
  CommentFormValues,
  Review,
  ReviewFormValues,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export class ApiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function toApiError(err: unknown): never {
  if (err instanceof AxiosError) {
    if (!err.response) {
      throw new ApiRequestError(
        "Can't reach the server. Check your connection and try again."
      );
    }
    const message = (err.response.data as { error?: string })?.error ?? "Something went wrong.";
    throw new ApiRequestError(message, err.response.status);
  }
  throw new ApiRequestError("Something went wrong.");
}

// ---- Books -----------------------------------------------------------------

export async function fetchBooks(filters: BookFilters = {}): Promise<Book[]> {
  try {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.genre) params.genre = filters.genre;
    if (filters.author) params.author = filters.author;
    if (filters.minRating) params.minRating = String(filters.minRating);
    if (filters.sort) params.sort = filters.sort;

    const { data } = await api.get<{ data: Book[] }>("/books", { params });
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function fetchBook(id: string): Promise<BookWithReviews> {
  try {
    const { data } = await api.get<{ data: BookWithReviews }>(`/books/${id}`);
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function createBook(payload: BookFormValues): Promise<Book> {
  try {
    const { data } = await api.post<{ data: Book }>("/books", {
      ...payload,
      publicationYear: Number(payload.publicationYear),
    });
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

// ---- Review comments --------------------------------------------------------

export async function fetchComments(reviewId: string): Promise<Comment[]> {
  try {
    const { data } = await api.get<{ data: Comment[] }>(`/reviews/${reviewId}/comments`);
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function createComment(reviewId: string, payload: CommentFormValues): Promise<Comment> {
  try {
    const { data } = await api.post<{ data: Comment }>(`/reviews/${reviewId}/comments`, payload);
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function deleteComment(id: string): Promise<void> {
  try {
    await api.delete(`/comments/${id}`);
  } catch (err) {
    toApiError(err);
  }
}

// ---- Reviews -----------------------------------------------------------------

export async function createReview(bookId: string, payload: ReviewFormValues): Promise<Review> {
  try {
    const { data } = await api.post<{ data: Review }>(`/books/${bookId}/reviews`, payload);
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function updateReview(id: string, payload: ReviewFormValues): Promise<Review> {
  try {
    const { data } = await api.put<{ data: Review }>(`/reviews/${id}`, payload);
    return data.data;
  } catch (err) {
    toApiError(err);
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    await api.delete(`/reviews/${id}`);
  } catch (err) {
    toApiError(err);
  }
}
