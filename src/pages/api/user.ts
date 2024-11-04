import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API route handler for GET requests to fetch a user by username
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log("hello");
    const { username } = req.query;
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }
    try{
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Couldn't fetch user"});
  }
} else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method ${req.method} Not Allowed" });
  }
}
