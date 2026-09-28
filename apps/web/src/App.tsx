import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorGlitter } from "@/components/CursorGlitter";
import { PageTransition } from "@/components/PageTransition";
import Home from "@/pages/Home";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import AddBook from "@/pages/AddBook";
import AddReview from "@/pages/AddReview";
import EditReview from "@/pages/EditReview";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-transparent">
      <div className="dreamy-orb dreamy-orb-one" aria-hidden="true" />
      <div className="dreamy-orb dreamy-orb-two" aria-hidden="true" />
      <div className="dreamy-grid" aria-hidden="true" />
      <CursorGlitter />
      <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/books" element={<PageTransition><Books /></PageTransition>} />
            <Route path="/books/new" element={<PageTransition><AddBook /></PageTransition>} />
            <Route path="/books/:id" element={<PageTransition><BookDetails /></PageTransition>} />
            <Route path="/books/:bookId/reviews/new" element={<PageTransition><AddReview /></PageTransition>} />
            <Route path="/reviews/:id/edit" element={<PageTransition><EditReview /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      </div>
    </div>
  );
}
