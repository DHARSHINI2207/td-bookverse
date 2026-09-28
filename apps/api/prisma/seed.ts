import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedReview = { reviewerName: string; title: string; rating: number; content: string };
type SeedBook = {
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  coverUrl: string;
  description: string;
  reviews: SeedReview[];
};

const books: SeedBook[] = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    publicationYear: 1988,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0061122416-L.jpg",
    description:
      "A shepherd boy named Santiago travels from Spain to Egypt in search of treasure, discovering along the way that the real treasure was the journey and the wisdom he gathered.",
    reviews: [
      { reviewerName: "Maya Chen", title: "A gentle nudge toward your dreams", rating: 5, content: "I read this during a career transition and it felt like it was written for me. Simple language, huge ideas. I re-read the last twenty pages three times." },
      { reviewerName: "Devon Okafor", title: "Beautiful but a little on-the-nose", rating: 4, content: "The parable style works, though some of the 'Personal Legend' talk gets repetitive. Still, I underlined half the book." },
      { reviewerName: "Priya Nair", title: "Comfort read for uncertain times", rating: 5, content: "Short enough to finish in an evening, but it stays with you for weeks. Perfect for anyone feeling stuck." },
    ],
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    publicationYear: 2018,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg",
    description:
      "A practical, research-backed guide to building good habits and breaking bad ones through small, incremental changes that compound over time.",
    reviews: [
      { reviewerName: "Tom Reyes", title: "Actually changed my routine", rating: 5, content: "I've read a dozen productivity books and this is the one that actually stuck. The habit-stacking chapter alone was worth the price." },
      { reviewerName: "Sofia Marin", title: "Clear, actionable, occasionally repetitive", rating: 4, content: "Great frameworks (cue-craving-response-reward) but the middle section could have been tighter. Still recommend it to everyone." },
      { reviewerName: "Liam Foster", title: "The best habits book I've found", rating: 5, content: "The '1% better every day' framing rewired how I think about goals versus systems. Practical worksheets too." },
      { reviewerName: "Anika Desai", title: "Solid, if a bit formulaic", rating: 4, content: "Good structure and lots of examples, though it leans heavily on the same handful of case studies." },
    ],
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    publicationYear: 1949,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0451524934-L.jpg",
    description:
      "In a totalitarian future ruled by the Party and Big Brother, Winston Smith begins to question the regime that controls even his own thoughts.",
    reviews: [
      { reviewerName: "Grace Kim", title: "Terrifyingly relevant", rating: 5, content: "Reading this in the age of constant surveillance and algorithmic feeds hits differently. Orwell nailed something timeless about power." },
      { reviewerName: "Noah Bergstrom", title: "Bleak, brilliant, essential", rating: 5, content: "Not a comfortable read, but one of the most important novels of the twentieth century. The Newspeak appendix is genius." },
      { reviewerName: "Isabella Rossi", title: "Slow start, devastating finish", rating: 4, content: "Takes a while to get going but Room 101 will stay with me forever. Required reading." },
    ],
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publicationYear: 1937,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0547928227-L.jpg",
    description:
      "Bilbo Baggins, a reluctant hobbit, is swept into an epic quest to reclaim a dwarf kingdom from the fearsome dragon Smaug.",
    reviews: [
      { reviewerName: "Ethan Wallace", title: "The perfect adventure story", rating: 5, content: "Warmer and more whimsical than Lord of the Rings, and just as beautifully written. Riddles in the Dark is a masterclass in tension." },
      { reviewerName: "Zoe Andersson", title: "Great for reading aloud", rating: 5, content: "Read this to my kids and we all loved it equally. The songs are a bit much but the journey is magical." },
      { reviewerName: "Marcus Webb", title: "Charming, if you know what you're getting", rating: 4, content: "Lighter and more episodic than I expected coming from the movies, but a wonderful introduction to Middle-earth." },
    ],
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publicationYear: 1997,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0747532699-L.jpg",
    description:
      "An orphaned boy discovers on his eleventh birthday that he is a wizard, and is whisked away to Hogwarts School of Witchcraft and Wizardry.",
    reviews: [
      { reviewerName: "Charlotte Byrne", title: "Still magical on the tenth re-read", rating: 5, content: "There's a reason this launched a generation of readers. The world-building feels effortless and the mystery is genuinely fun." },
      { reviewerName: "Ravi Shankar", title: "A perfect gateway book", rating: 5, content: "Gave this to my nephew who 'hated reading' and he finished the whole series in a month. Speaks for itself." },
      { reviewerName: "Hannah Lindqvist", title: "Simple but so much fun", rating: 4, content: "The prose is aimed squarely at younger readers, but the plotting and Hogwarts atmosphere hold up as an adult." },
    ],
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Non-Fiction",
    publicationYear: 2020,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0857197681-L.jpg",
    description:
      "Short, story-driven essays exploring how emotions, ego, and personal history shape our financial decisions far more than spreadsheets do.",
    reviews: [
      { reviewerName: "Oliver Bennett", title: "Reframed how I think about saving", rating: 5, content: "Not a single formula in this book, and it's better for it. The chapter on 'enough' should be required reading." },
      { reviewerName: "Fatima Al-Sayed", title: "Bite-sized wisdom", rating: 5, content: "Each chapter stands alone, which made it easy to read a bit before bed. Housel is a fantastic storyteller." },
      { reviewerName: "Diego Fernandez", title: "Good, though light on specifics", rating: 4, content: "If you want tactical investment advice look elsewhere, but as a book about mindset around money it's excellent." },
    ],
  },
  {
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    genre: "Self-Help",
    publicationYear: 2016,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0143130722-L.jpg",
    description:
      "A journey into the Japanese concept of ikigai — one's reason for being — drawing on interviews with the world's longest-living people.",
    reviews: [
      { reviewerName: "Sarah Whitfield", title: "Calming and thought-provoking", rating: 4, content: "Light on hard data but heavy on perspective. I liked the Okinawa interviews the most." },
      { reviewerName: "Kenji Watanabe", title: "A gentle introduction to the idea", rating: 4, content: "As someone from Japan, I found the concept slightly oversimplified for a Western audience, but the core message is solid." },
      { reviewerName: "Elena Petrova", title: "Short, sweet, and worth revisiting", rating: 5, content: "Read it in one sitting on a rainy afternoon. The diagrams about purpose vs. passion vs. mission are genuinely useful." },
    ],
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    publicationYear: 1925,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0743273567-L.jpg",
    description:
      "Jay Gatsby's obsessive love for Daisy Buchanan unfolds against the glittering, hollow backdrop of the Jazz Age on Long Island.",
    reviews: [
      { reviewerName: "Benjamin Cross", title: "Prose that still dazzles a century later", rating: 5, content: "Every sentence is doing work. The green light at the end of the dock is one of the great images in American literature." },
      { reviewerName: "Amelia Novak", title: "Tragic and gorgeous", rating: 5, content: "Reread this for the first time since high school and appreciated the critique of the American Dream so much more as an adult." },
      { reviewerName: "Julian Ade", title: "Short but dense", rating: 4, content: "It's slim, but there's a lot packed into it. Nick as narrator is more unreliable than I remembered." },
    ],
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic",
    publicationYear: 1813,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0141439513-L.jpg",
    description:
      "Elizabeth Bennet navigates manners, morality, and marriage in Georgian England, sparring with — and slowly falling for — the proud Mr. Darcy.",
    reviews: [
      { reviewerName: "Clara Jensen", title: "The wit holds up perfectly", rating: 5, content: "Austen's dialogue is so sharp it barely feels two hundred years old. Elizabeth is one of the best characters ever written." },
      { reviewerName: "Nathaniel Osei", title: "A rom-com blueprint before rom-coms existed", rating: 5, content: "The slow-burn tension between Elizabeth and Darcy is masterfully paced. Surprisingly funny too." },
      { reviewerName: "Ingrid Solberg", title: "Took a while to click for me", rating: 4, content: "The period-specific social customs took some getting used to, but once I settled in I couldn't put it down." },
    ],
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    publicationYear: 1965,
    coverUrl: "https://covers.openlibrary.org/b/isbn/0441013597-L.jpg",
    description:
      "On the desert planet Arrakis, young Paul Atreides is thrust into a war over the galaxy's most valuable resource — and a destiny far larger than himself.",
    reviews: [
      { reviewerName: "Victor Hale", title: "Dense world-building done right", rating: 5, content: "The ecology of Arrakis feels as real as the politics. Takes patience but the payoff in the back half is enormous." },
      { reviewerName: "Yuki Tanaka", title: "Best sci-fi novel I've read", rating: 5, content: "Herbert built an entire universe of religion, ecology, and politics that still influences the genre sixty years later." },
      { reviewerName: "Camille Dubois", title: "Slow first act, incredible arc", rating: 4, content: "It took me almost 150 pages to get hooked, but Paul's transformation across the book is genuinely epic once it lands." },
    ],
  },
];

async function main() {
  console.log("Seeding T&D BookVerse database...");

  await prisma.review.deleteMany();
  await prisma.book.deleteMany();

  for (const { reviews, ...book } of books) {
    await prisma.book.create({
      data: {
        ...book,
        reviews: { create: reviews },
      },
    });
    console.log(`  ✓ ${book.title}`);
  }

  console.log(`Seed complete: ${books.length} books, ${books.reduce((n, b) => n + b.reviews.length, 0)} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
