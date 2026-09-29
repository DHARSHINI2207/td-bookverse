import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { fetchBook, updateBook, ApiRequestError } from "@/services/api";
import { useToast } from "@/hooks/useToast";
import type { BookFormValues } from "@/types";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Science Fiction",
  "Dystopian",
  "Classic",
  "Self-Help",
  "Mystery",
  "Romance",
  "Biography",
];

const inputClass =
  "w-full rounded-lg border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface px-3.5 py-2.5 text-sm outline-none focus:border-forest dark:focus:border-brass-light transition-colors";
const labelClass = "mb-1.5 block text-sm font-medium";
const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400";

function validate(values: BookFormValues) {
  const errors: Partial<Record<keyof BookFormValues, string>> = {};
  if (!values.title.trim()) errors.title = "Book title is required.";
  if (!values.author.trim()) errors.author = "Author name is required.";
  if (!values.genre.trim()) errors.genre = "Please choose a genre.";
  if (values.publicationYear === "" || Number.isNaN(Number(values.publicationYear))) {
    errors.publicationYear = "Publication year is required.";
  } else if (
    Number(values.publicationYear) > new Date().getFullYear() + 1 ||
    Number(values.publicationYear) < 1000
  ) {
    errors.publicationYear = "Enter a realistic publication year.";
  }
  if (!values.coverUrl.trim()) {
    errors.coverUrl = "A cover image URL is required.";
  } else {
    try {
      new URL(values.coverUrl);
    } catch {
      errors.coverUrl = "Enter a valid URL.";
    }
  }
  if (!values.description.trim()) errors.description = "A short description is required.";
  return errors;
}

export default function EditBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState<BookFormValues>({
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    coverUrl: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormValues, string>>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBook(id)
      .then((book) => {
        setValues({
          title: book.title,
          author: book.author,
          genre: book.genre,
          publicationYear: book.publicationYear,
          coverUrl: book.coverUrl,
          description: book.description,
        });
      })
      .catch((err) => {
        showToast(err instanceof ApiRequestError ? err.message : "Couldn't load this book.", "error");
        navigate("/books");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, showToast]);

  const setField = <K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const book = await updateBook(id, values);
      showToast("Book updated successfully!");
      navigate(`/books/${book.id}`);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Couldn't update this book.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-ink-muted dark:text-parchment/60">Loading book...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink dark:text-parchment/60 dark:hover:text-parchment"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-semibold">Edit book</h1>
        <p className="mt-1.5 text-ink-muted dark:text-parchment/60">
          Update the book information shown on the BookVerse shelf.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label className={labelClass} htmlFor="title">Book title</label>
            <input id="title" className={inputClass} value={values.title} onChange={(e) => setField("title", e.target.value)} />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="author">Author name</label>
              <input id="author" className={inputClass} value={values.author} onChange={(e) => setField("author", e.target.value)} />
              {errors.author && <p className={errorClass}>{errors.author}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="year">Publication year</label>
              <input
                id="year"
                type="number"
                className={inputClass}
                value={values.publicationYear}
                onChange={(e) => setField("publicationYear", e.target.value === "" ? "" : Number(e.target.value))}
              />
              {errors.publicationYear && <p className={errorClass}>{errors.publicationYear}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="genre">Genre</label>
            <select id="genre" className={inputClass} value={values.genre} onChange={(e) => setField("genre", e.target.value)}>
              <option value="">Select a genre</option>
              {GENRES.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
            </select>
            {errors.genre && <p className={errorClass}>{errors.genre}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="cover">Book cover URL</label>
            <input id="cover" className={inputClass} value={values.coverUrl} onChange={(e) => setField("coverUrl", e.target.value)} />
            {errors.coverUrl && <p className={errorClass}>{errors.coverUrl}</p>}
            {values.coverUrl && !errors.coverUrl && (
              <img src={values.coverUrl} alt="Cover preview" className="mt-3 h-32 w-24 rounded object-cover shadow-card" />
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={5}
              className={inputClass}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors.description && <p className={errorClass}>{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-ink/15 dark:border-parchment/20 px-6 py-2.5 text-sm font-medium hover:bg-ink/5 dark:hover:bg-parchment/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
