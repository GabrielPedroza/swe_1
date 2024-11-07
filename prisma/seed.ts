// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
await prisma.rating.deleteMany({});
await prisma.review.deleteMany({});

async function main() {
  const books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      publisher: "Name here",
      //copies: 3,
      price: 10.99,
      publishedAt: new Date("1925-04-10"),
      tags: ["classic", "novel"],
      isbn: "9780743273565",
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      publisher: "Name here",
      //copies: 2,
      price: 8.99,
      publishedAt: new Date("1949-06-08"),
      tags: ["classic", "political", "novel"],
      isbn: "9780451524935",
    },
    {
      id: "3",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publisher: "Name here",
      //copies: 1,
      price: 7.99,
      publishedAt: new Date("1960-07-11"),
      tags: ["classic", "novel"],
      isbn: "9780061120084",
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      publisher: "Name here",
      genre: "Romance",
      //copies: 4,
      price: 6.99,
      publishedAt: new Date("1813-01-28"),
      tags: ["classic", "romance", "novel"],
      isbn: "9781503290563",
    },
    {
      id: "5",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      publisher: "Name here",
      genre: "Fantasy",
      //copies: 8,
      price: 12.99,
      publishedAt: new Date("1937-09-21"),
      tags: ["fantasy", "adventure", "classic"],
      isbn: "9780345339683",
    },
    {
      id: "6",
      title: "Moby Dick",
      author: "Herman Melville",
      genre: "Adventure",
      publisher: "Name here",
      //copies: 6,
      price: 9.99,
      publishedAt: new Date("1851-10-18"),
      tags: ["classic", "adventure", "novel"],
      isbn: "9781503280786",
    },
    {
      id: "7",
      title: "War and Peace",
      author: "Leo Tolstoy",
      genre: "Historical",
      publisher: "Name here",
      //copies: 1,
      price: 14.99,
      publishedAt: new Date("1869-01-01"),
      tags: ["classic", "historical", "novel"],
      isbn: "9780199232765",
    },
    {
      id: "8",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      publisher: "Name here",
      //copies: 4,
      price: 8.49,
      publishedAt: new Date("1951-07-16"),
      tags: ["classic", "novel"],
      isbn: "9780316769488",
    },
    {
      id: "9",
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      publisher: "Name here",
      //copies: 5,
      price: 9.49,
      publishedAt: new Date("1932-08-30"),
      tags: ["dystopian", "classic", "novel"],
      isbn: "9780060850524",
    },
    {
      id: "10",
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      publisher: "Name here",
      genre: "Fantasy",
      //copies: 2,
      price: 25.99,
      publishedAt: new Date("1954-07-29"),
      tags: ["fantasy", "epic", "adventure"],
      isbn: "9780544003415",
    },
    {
      id: "11",
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      publisher: "Name here",
      genre: "Romance",
      //copies: 1,
      price: 7.49,
      publishedAt: new Date("1847-10-16"),
      tags: ["classic", "romance", "novel"],
      isbn: "9780141441146",
    },
    {
      id: "12",
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      genre: "Psychological",
      publisher: "Name here",
      //copies: 12,
      price: 11.99,
      publishedAt: new Date("1866-01-01"),
      tags: ["classic", "psychological", "novel"],
      isbn: "9780486415871",
    },
    {
      id: "13",
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      publisher: "Name here",
      //copies: 3,
      price: 10.49,
      publishedAt: new Date("1988-05-01"),
      tags: ["fiction", "philosophical", "novel"],
      isbn: "9780061122415",
    },
    {
      id: "14",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      publisher: "Name here",
      genre: "Fantasy",
      //copies: 2,
      price: 8.99,
      publishedAt: new Date("1997-06-26"),
      tags: ["fantasy", "young adult", "novel"],
      isbn: "9780590353427",
    },
    {
      id: "15",
      title: "The Kite Runner",
      publisher: "Name here",
      author: "Khaled Hosseini",
      genre: "Drama",
      //copies: 5,
      price: 9.99,
      publishedAt: new Date("2003-05-29"),
      tags: ["drama", "classic", "novel"],
      isbn: "9781594480003",
    },
    {
      id: "16",
      title: "The Da Vinci Code",
      author: "Dan Brown",
      publisher: "Name here",
      genre: "Mystery",
      //copies: 6,
      price: 7.99,
      publishedAt: new Date("2003-04-03"),
      tags: ["mystery", "thriller", "novel"],
      isbn: "9780307474278",
    },
    {
      id: "17",
      title: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      publisher: "Name here",
      genre: "Fantasy",
      //copies: 2,
      price: 19.99,
      publishedAt: new Date("1956-10-16"),
      tags: ["fantasy", "children", "classic"],
      isbn: "9780064471190",
    },
    {
      id: "18",
      title: "Les Misérables",
      author: "Victor Hugo",
      publisher: "Name here",
      genre: "Historical",
      //copies: 10,
      price: 13.99,
      publishedAt: new Date("1862-01-01"),
      tags: ["classic", "historical", "novel"],
      isbn: "9780451419439",
    },
    {
      id: "19",
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      publisher: "Name here",
      genre: "Fiction",
      //copies: 1,
      price: 5.99,
      publishedAt: new Date("1943-04-06"),
      tags: ["classic", "children", "novel"],
      isbn: "9780156012195",
    },
    {
      id: "20",
      title: "The Shining",
      author: "Stephen King",
      genre: "Horror",
      publisher: "Name here",
      //copies: 9,
      price: 9.49,
      publishedAt: new Date("1977-01-28"),
      tags: ["horror", "thriller", "novel"],
      isbn: "9780307743657",
    },
    {
      id: "21",
      title: "Gone with the Wind",
      author: "Margaret Mitchell",
      publisher: "Name here",
      genre: "Historical",
      //copies: 3,
      price: 12.49,
      publishedAt: new Date("1936-06-30"),
      tags: ["classic", "historical", "romance"],
      isbn: "9781451635621",
    },
    {
      id: "22",
      title: "Heart of Darkness",
      author: "Joseph Conrad",
      publisher: "Name here",
      genre: "Fiction",
      //copies: 3,
      price: 9.24,
      publishedAt: new Date("1899-04-01"),
      tags: ["psychological", "novella", "roman a clef"],
      isbn: "9781503275928",
    },
    {
      id: "23",
      title: "The Canterbury Tales",
      author: "Geoffrey Chaucer",
      genre: "Poetry",
      publisher: "Name here",
      //copies: 3,
      price: 13.92,
      publishedAt: new Date("1899-04-01"),
      tags: ["romance", "fiction", "anthology"],
      isbn: "9780140424386",
    },
    {
      id: "24",
      title: "Dracula",
      author: "Bram Stoker",
      genre: "Horror",
      publisher: "Name here",
      //copies: 5,
      price: 9.99,
      publishedAt: new Date("1897-05-26"),
      tags: ["gothic", "fiction", "fantasy"],
      isbn: "9780141439846",
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
      bookId: "1",
      userId: "142547",
      content: "Amazing read.",
      score: 4.00,
      reviewDate: new Date("2024-01-07"),
    },
    {
      id: "162742",
      bookId: "2",
      userId: "253281",
      content: "Thrilling and entertaining.",
      score: 3.00,
      reviewDate: new Date("2024-06-10"),
    },
    {
      id: "911893",
      bookId: "3",
      userId: "836273",
      content: "Well written and thought provoking.",
      score: 4.00,
      reviewDate: new Date("2024-05-17"),
    },
  ];

  const ratings = [
    {
      id: "617541",
      bookId: "1",
      userId: "142547",
      score: 4.00,
      ratingDate: new Date("2024-01-08"),
    },
    {
      id: "162742",
      bookId: "2",
      userId: "253281",
      score: 5.00,
      ratingDate: new Date("2024-06-11"),
    },
    {
      id: "911893",
      bookId: "3",
      userId: "836273",
      score: 3.00,
      ratingDate: new Date("2024-05-18"),
    },
  ];

  const shoppingCarts = [
    {
      id: "738169",
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
      cartId: "738169",
      bookId: "1",
      quantity: 1,
      addedAt: new Date("2024-08-09"),
    },
    {
      id: "387104",
      cartId: "452614",
      bookId: "2",
      quantity: 2,
      addedAt: new Date("2024-08-12"),
    },
    {
      id: "013625",
      cartId: "693165",
      bookId: "3",
      quantity: 3,
      addedAt: new Date("2024-08-15"),
    },
  ];
  const creditCards = [
    {
      id: "686424",
      userId: "142547",
      cardNumber: "1636949339151732",
      cardHolderName: "Jane Doe",
      expirationDate: new Date("2026-01-12"),
      createdAt: new Date("2024-09-03"),
      updatedAt: new Date("2024-09-03"),
    },
    {
      id: "981363",
      userId: "253281",
      cardNumber: "1103378283918451",
      cardHolderName: "John Doe",
      expirationDate: new Date("2027-05-03"),
      createdAt: new Date("2024-09-04"),
      updatedAt: new Date("2024-09-04"),
    },
    {
      id: "472461",
      userId: "836273",
      cardNumber: "1028562889691423",
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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
