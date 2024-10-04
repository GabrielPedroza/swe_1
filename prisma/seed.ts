// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      copies: 3,
      price: 10.99,
      publishedAt: new Date("1925-04-10"),
      tags: ["classic", "novel"],
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      copies: 2,
      price: 8.99,
      publishedAt: new Date("1949-06-08"),
      tags: ["classic", "political", "novel"],
    },
    {
      id: "3",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      copies: 1,
      price: 7.99,
      publishedAt: new Date("1960-07-11"),
      tags: ["classic", "novel"],
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      copies: 4,
      price: 6.99,
      publishedAt: new Date("1813-01-28"),
      tags: ["classic", "romance", "novel"],
    },
    {
      id: "5",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      copies: 8,
      price: 12.99,
      publishedAt: new Date("1937-09-21"),
      tags: ["fantasy", "adventure", "classic"],
    },
    {
      id: "6",
      title: "Moby Dick",
      author: "Herman Melville",
      genre: "Adventure",
      copies: 6,
      price: 9.99,
      publishedAt: new Date("1851-10-18"),
      tags: ["classic", "adventure", "novel"],
    },
    {
      id: "7",
      title: "War and Peace",
      author: "Leo Tolstoy",
      genre: "Historical",
      copies: 1,
      price: 14.99,
      publishedAt: new Date("1869-01-01"),
      tags: ["classic", "historical", "novel"],
    },
    {
      id: "8",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      copies: 4,
      price: 8.49,
      publishedAt: new Date("1951-07-16"),
      tags: ["classic", "novel"],
    },
    {
      id: "9",
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      copies: 5,
      price: 9.49,
      publishedAt: new Date("1932-08-30"),
      tags: ["dystopian", "classic", "novel"],
    },
    {
      id: "10",
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      copies: 2,
      price: 25.99,
      publishedAt: new Date("1954-07-29"),
      tags: ["fantasy", "epic", "adventure"],
    },
    {
      id: "11",
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      genre: "Romance",
      copies: 1,
      price: 7.49,
      publishedAt: new Date("1847-10-16"),
      tags: ["classic", "romance", "novel"],
    },
    {
      id: "12",
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      genre: "Psychological",
      copies: 12,
      price: 11.99,
      publishedAt: new Date("1866-01-01"),
      tags: ["classic", "psychological", "novel"],
    },
    {
      id: "13",
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      copies: 3,
      price: 10.49,
      publishedAt: new Date("1988-05-01"),
      tags: ["fiction", "philosophical", "novel"],
    },
    {
      id: "14",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      genre: "Fantasy",
      copies: 2,
      price: 8.99,
      publishedAt: new Date("1997-06-26"),
      tags: ["fantasy", "young adult", "novel"],
    },
    {
      id: "15",
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      genre: "Drama",
      copies: 5,
      price: 9.99,
      publishedAt: new Date("2003-05-29"),
      tags: ["drama", "classic", "novel"],
    },
    {
      id: "16",
      title: "The Da Vinci Code",
      author: "Dan Brown",
      genre: "Mystery",
      copies: 6,
      price: 7.99,
      publishedAt: new Date("2003-04-03"),
      tags: ["mystery", "thriller", "novel"],
    },
    {
      id: "17",
      title: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      genre: "Fantasy",
      copies: 2,
      price: 19.99,
      publishedAt: new Date("1956-10-16"),
      tags: ["fantasy", "children", "classic"],
    },
    {
      id: "18",
      title: "Les Misérables",
      author: "Victor Hugo",
      genre: "Historical",
      copies: 10,
      price: 13.99,
      publishedAt: new Date("1862-01-01"),
      tags: ["classic", "historical", "novel"],
    },
    {
      id: "19",
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      genre: "Fiction",
      copies: 1,
      price: 5.99,
      publishedAt: new Date("1943-04-06"),
      tags: ["classic", "children", "novel"],
    },
    {
      id: "20",
      title: "The Shining",
      author: "Stephen King",
      genre: "Horror",
      copies: 9,
      price: 9.49,
      publishedAt: new Date("1977-01-28"),
      tags: ["horror", "thriller", "novel"],
    },
    {
      id: "21",
      title: "Gone with the Wind",
      author: "Margaret Mitchell",
      genre: "Historical",
      copies: 3,
      price: 12.49,
      publishedAt: new Date("1936-06-30"),
      tags: ["classic", "historical", "romance"],
    },
    {
      id: "22",
      title: "Heart of Darkness",
      author: "Joseph Conrad",
      genre: "Fiction",
      copies: 3,
      price: 9.24,
      publishedAt: new Date("1899-04-01"),
      tags: ["psychological", "novella", "roman a clef"],
    },
    {
      id: "23",
      title: "The Canterbury Tales",
      author: "Geoffrey Chaucer",
      genre: "Poetry",
      copies: 3,
      price: 13.92,
      publishedAt: new Date("1899-04-01"),
      tags: ["romance", "fiction", "anthology"],
    },
    {
      id: "24",
      title: "Dracula",
      author: "Bram Stoker",
      genre: "Horror",
      copies: 5,
      price: 9.99,
      publishedAt: new Date("1897-05-26"),
      tags: ["gothic", "fiction", "fantasy"],
    },
  ];

  const users = [
    {
      id: "142547",
      username: "janeDoe",
      email: "janedoe@gmail.com",
      emailVerified: new Date("2024-01-01"),
      password: "5GjBCQ6",
      image: "profilepic",
    },
    {
      id: "253281",
      username: "johnDoe",
      email: "johndoe@gmail.com",
      emailVerified: new Date("2024-06-05"),
      password: "6VGh62",
      image: "profilepic2",
    },
    {
      id: "836273",
      username: "jamesRobert",
      email: "jamesrobert@gmail.com",
      emailVerified: new Date("2024-05-03"),
      password: "8d34Jh",
      image: "profilepic3",
    },
  ];

  const reviews = [
    {
      id: "617541",
      bookId: "347",
      userId: "142547",
      content: "Amazing read.",
      score: 4.00,
      reviewDate: new Date("2024-01-07"),
    },
    {
      id: "162742",
      bookId: "236",
      userId: "253281",
      content: "Thrilling and entertaining.",
      score: 3.00,
      reviewDate: new Date("2024-03-15"),
    },
    {
      id: "911893",
      bookId: "465",
      userId: "836273",
      content: "Well written and thought provoking.",
      score: 4.00,
      reviewDate: new Date("2024-04-17"),
    },
  ];

  const ratings = [
    {
      id: "167234",
      bookId: "347",
      userId: "617541",
      score: 4.00,
    },
    {
      id: "178109",
      bookId: "236",
      userId: "253281",
      score: 5.00,
    },
    {
      id: "102346",
      bookId: "465",
      userId: "836273",
      score: 3.00,
    },
  ];

  const shoppingCarts = [
    {
      id: "73816",
      userId: "142547",
      createdAt: new Date("2024-01-09"),
      updatedAt: new Date("2024-01-10"),
    },
    {
      id: "452614",
      userId: "253281",
      createdAt: new Date("2024-01-09"),
      updatedAt: new Date("2024-01-10"),
    },
    {
      id: "693165",
      userId: "836273",
      createdAt: new Date("2024-01-09"),
      updatedAt: new Date("2024-01-10"),
    },
  ];
  const cartItems = [
    {
      id: "153824",
      cartId: "198392",
      bookId: "347",
      quantity: 1,
      addedAt: new Date("2024-08-09"),
    },
    {
      id: "387104",
      cartId: "729184",
      bookId: "347",
      quantity: 2,
      addedAt: new Date("2024-08-12"),
    },
    {
      id: "013625",
      cartId: "812642",
      bookId: "347",
      quantity: 3,
      addedAt: new Date("2024-08-15"),
    },
  ];
  const creditCards = [
    {
      id: "686424",
      user: "janeDoe",
      userId: "142547",
      cardNumber: "1636 9493 3915 1732",
      cardHolderName: "Jane Doe",
      expirationDate: new Date("2026-01-12"),
      createdAt: new Date("2024-09-03"),
      updatedAt: new Date("2024-09-03"),
    },
    {
      id: "981363",
      user: "johnDoe",
      userId: "253281",
      cardNumber: "1103 3782 8391 8451",
      cardHolderName: "John Doe",
      expirationDate: new Date("2027-05-03"),
      createdAt: new Date("2024-09-04"),
      updatedAt: new Date("2024-09-04"),
    },
    {
      id: "686424",
      user: "janeDoe",
      userId: "836273",
      cardNumber: "1028 5628 8969 1423",
      cardHolderName: "James Robert",
      expirationDate: new Date("2027-06-17"),
      createdAt: new Date("2024-09-05"),
      updatedAt: new Date("2024-09-05"),
    },
  ];

  // Insert books using createMany for efficiency
  await prisma.book.createMany({
    data: books,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique constraints
  });

  console.log("Inserted 23 books successfully.");

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique constraints
  });
  console.log("Inserted 3 users successfully.");

  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique contraints
  });
  console.log("Inserted 3 reviews successfully.");

  await prisma.rating.createMany({
    data: ratings,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique contraints
  });
  console.log("Inserted 3 ratings successfully.");

  await prisma.shoppingCart.createMany({
    data: shoppingCarts,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique contraints
  });
  console.log("Inserted 3 shopping carts successfully.");

  await prisma.cartItem.createMany({
    data: cartItems,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique contraints
  });
  console.log("Inserted 3 cart items sucessfully.");

  await prisma.creditCard.createMany({
    data: creditCards,
    skipDuplicates: true, // Optional: skips inserting records that would violate unique contraints
  });
  console.log("Inserted 3 credit cards successfully.");
}

main()
  .catch((e) => {
    console.error("Error inserting books:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
