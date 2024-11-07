import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API route handler for GET requests to fetch a user by username
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {rating, userId, bookId} = req.body;
    
    if (typeof rating != 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Please use a rating that is an integer between 1 and 5" });
    }
    try{
      console.log("Recevied", {rating, userId, bookId});
      const userFound = await prisma.user.findUnique({
              where: {id: userId},
      });
      let newRating;
      newRating = await prisma.rating.create({
        data: {
          score: rating,
          user: {connect: {id: userId}},
          book: {connect: {id: bookId}},
          ratingDate: new Date(),
        },
      });
      let averageRating;
      averageRating = await prisma.rating.aggregate({
        where: {bookId},
        _avg: {score: true},
      });



    //return res.status(201).json({message: "Post was successful."});
    return res.status(202).json(newRating);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Couldn't post rating."});
  }
} 

else if (req.method === "GET") {
  const {bookId} = req.query;
  
  
  try{
    console.log("Recevied", {bookId});
    let averageRating;
    averageRating = await prisma.rating.aggregate({
      where: {bookId: String(bookId)},
      _avg: {score: true},
    });
    const truncateAvg = Math.floor((averageRating._avg.score || 0)*100)/100;


  
  
  return res.status(202).json(truncateAvg);
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Couldn't get average rating."});
}
} 

else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method ${req.method} Not Allowed" });
  }
}