// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      price: 10.99,
      publishedAt: new Date("1925-04-10"),
      tags: ["classic", "novel"],
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      price: 8.99,
      publishedAt: new Date("1949-06-08"),
      tags: ["classic", "political", "novel"],
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      price: 7.99,
      publishedAt: new Date("1960-07-11"),
      tags: ["classic", "novel"],
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      price: 6.99,
      publishedAt: new Date("1813-01-28"),
      tags: ["classic", "romance", "novel"],
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      price: 12.99,
      publishedAt: new Date("1937-09-21"),
      tags: ["fantasy", "adventure", "classic"],
    },
    {
      title: "Moby Dick",
      author: "Herman Melville",
      genre: "Adventure",
      price: 9.99,
      publishedAt: new Date("1851-10-18"),
      tags: ["classic", "adventure", "novel"],
    },
    {
      title: "War and Peace",
      author: "Leo Tolstoy",
      genre: "Historical",
      price: 14.99,
      publishedAt: new Date("1869-01-01"),
      tags: ["classic", "historical", "novel"],
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      price: 8.49,
      publishedAt: new Date("1951-07-16"),
      tags: ["classic", "novel"],
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      price: 9.49,
      publishedAt: new Date("1932-08-30"),
      tags: ["dystopian", "classic", "novel"],
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      price: 25.99,
      publishedAt: new Date("1954-07-29"),
      tags: ["fantasy", "epic", "adventure"],
    },
    {
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      genre: "Romance",
      price: 7.49,
      publishedAt: new Date("1847-10-16"),
      tags: ["classic", "romance", "novel"],
    },
    {
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      genre: "Psychological",
      price: 11.99,
      publishedAt: new Date("1866-01-01"),
      tags: ["classic", "psychological", "novel"],
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      price: 10.49,
      publishedAt: new Date("1988-05-01"),
      tags: ["fiction", "philosophical", "novel"],
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      genre: "Fantasy",
      price: 8.99,
      publishedAt: new Date("1997-06-26"),
      tags: ["fantasy", "young adult", "novel"],
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      genre: "Drama",
      price: 9.99,
      publishedAt: new Date("2003-05-29"),
      tags: ["drama", "classic", "novel"],
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      genre: "Mystery",
      price: 7.99,
      publishedAt: new Date("2003-04-03"),
      tags: ["mystery", "thriller", "novel"],
    },
    {
      title: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      genre: "Fantasy",
      price: 19.99,
      publishedAt: new Date("1956-10-16"),
      tags: ["fantasy", "children", "classic"],
    },
    {
      title: "Les Misérables",
      author: "Victor Hugo",
      genre: "Historical",
      price: 13.99,
      publishedAt: new Date("1862-01-01"),
      tags: ["classic", "historical", "novel"],
    },
    {
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      genre: "Fiction",
      price: 5.99,
      publishedAt: new Date("1943-04-06"),
      tags: ["classic", "children", "novel"],
    },
    {
      title: "The Shining",
      author: "Stephen King",
      genre: "Horror",
      price: 9.49,
      publishedAt: new Date("1977-01-28"),
      tags: ["horror", "thriller", "novel"],
    },
    {
      title: "Gone with the Wind",
      author: "Margaret Mitchell",
      genre: "Historical",
      price: 12.49,
      publishedAt: new Date("1936-06-30"),
      tags: ["classic", "historical", "romance"],
    },
  ];

  // Insert books using createMany for efficiency
  await prisma.book.createMany({
    data: books,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique constraints
  });

  console.log("Inserted 20 books successfully.");
}

main()
  .catch((e) => {
    console.error("Error inserting books:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
