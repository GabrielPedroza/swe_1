import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "@prisma/client";

// Define the array structure
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  copiesSold: number;
  publishedAt: Date;
  reviews: Review[];
  tags: string[];
  ratings: Rating[];
}

// Define review section
interface Review {
  reviewer: string;
  comment: string;
  rating: number;
}

// Define rating section
interface Rating {
  user: string;
  score: number;
}

// Define array of books
const books: Book[] = [
  {
    id: 1,
    title: "SCRUM Master",
    author: "Alex Roque",
    genre: "Educational",
    price: 9.99,
    copiesSold: 100000,
    publishedAt: new Date("2024-09-26"),
    reviews: [
      { reviewer: "Smeraldo Smeraldi", comment: "Amazing!", rating: 5 },
      { reviewer: "Steve Rogers", comment: "Very nice book, buy it!", rating: 5 }
    ],
    tags: ["Educational", "FIU"],
    ratings: [
      { user: "user1", score: 5 },
      { user: "user2", score: 5 }
    ]
  },
{
  id: 2,
    title: "System Programming",
    author: "Eric Ackerman",
    genre: "Educational",
    price: 14.99,
    copiesSold: 100001,
    publishedAt: new Date("2024-07-26"),
    reviews: [
      { reviewer: "John Smith", comment: "Changed my life!", rating: 5 },
      { reviewer: "Clint Barton", comment: "WOW", rating: 4.5 }
    ],
    tags: ["Educational", "FIU"],
    ratings: [
      { user: "user1", score: 5 },
      { user: "user2", score: 5 }
    ]
  },

  {
    id: 3,
    title: "Anne of the Green Gables",
    author: "Lucy Maud Montgomery",
    genre: "Fiction",
    price: 15.99,
    copiesSold: 1000000,
    publishedAt: new Date("1908-06-20"),
    reviews: [
      { reviewer: "Dick Greyson", comment: "A classic!", rating: 5 },
      { reviewer: "Bruce Wayne", comment: "Mid", rating: 2.8 }
    ],
    tags: ["fiction", "classic", "children"],
    ratings: [
      { user: "user3", score: 5 },
      { user: "user4", score: 2.8 }
    ]
  }
];

// Handler function | Handles API Requests !!!
export default function handler(req: NextApiRequest, res: NextApiResponse) 
{
  const { genre, sortBy } = req.query;


  //sort all books
  let filteredBooks = books;

  //sort by genre
  if (genre) {
    if (typeof genre !== 'string') {
      return res.status(400).json({ error: 'Wrong parameter' });
    }
    //ignore capital letters
    filteredBooks = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  }

  // sort by number of copiesSold
  if (sortBy === 'copiesSold') {
    filteredBooks = filteredBooks.sort((a, b) => b.copiesSold - a.copiesSold);
  }

  //return sorted books
  res.status(200).json(filteredBooks);
}




/* 
Postman Commands:
http://localhost:3000/api/books
http://localhost:3000/api/books?genre=fiction
http://localhost:3000/api/books?sortBy=copiesSold
http://localhost:3000/api/books?genre=Educational&sortBy=copiesSold

*/