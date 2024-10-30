import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API route handler for GET requests to fetch a user by username
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {rating, review, userId, bookId} = req.body;
    
    if (typeof review != 'string') {
      return res.status(400).json({ error: "Please enter a review" });
    }
    try{
      console.log("Recevied", {review, userId, bookId});
      const userFound = await prisma.user.findUnique({
        where: {id: userId},
      });
      let newComment;
      newComment = await prisma.review.create({
        data: {
          score: rating,
          content: review,
          user: {connect: {id: userId}},
          book: {connect: {id: bookId}},
          reviewDate: new Date(),
        },
      });
      


    
    return res.status(202).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Couldn't post comment."});
  }
} else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method ${req.method} Not Allowed" });
  }
}
