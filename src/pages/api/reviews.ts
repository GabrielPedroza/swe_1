import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize Prisma
const prisma = new PrismaClient();

// Handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET requests to retrieve reviews
  if (req.method === 'GET') {
    try {
      const { bookId, userId } = req.query;

      // Filter reviews by bookId or userId if provided
      const reviews = await prisma.review.findMany({
        where: {
          ...(bookId ? { bookId: bookId as string } : {}),
          ...(userId ? { userId: userId as string } : {}),
        },
        include: {
          book: true, // Include book details
          user: true, // Include user details
        },
      });

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Handle POST requests to create a new review
  else if (req.method === 'POST') {
    try {
      const { bookId, userId, content } = req.body;

      // Validate required fields
      if (!bookId || !userId || !content) {
        return res.status(400).json({ error: 'Book ID, User ID, and content are required' });
      }

      // Create a new review
      const newReview = await prisma.review.create({
        data: {
          bookId,
          userId,
          content,
          reviewDate: new Date(),
        },
      });

      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Handle DELETE requests to delete a review
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      // Validate required query parameter
      if (!id) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      // Delete the review
      await prisma.review.delete({
        where: { id: id as string },
      });

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/*
Usage Examples:
- GET /api/reviews?bookId=1 (Fetch reviews for a specific book)
- GET /api/reviews?userId=142547 (Fetch reviews by a specific user)
- POST /api/reviews (Create a new review)
  Body: { bookId: "1", userId: "142547", content: "Amazing book!" }
- DELETE /api/reviews?id=617541 (Delete a review by ID)
*/
