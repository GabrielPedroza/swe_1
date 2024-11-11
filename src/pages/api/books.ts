import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') 
    {
    try 
    {
      const { genre, topSellers, rating } = req.query;

      if (topSellers) {
        // Retrieve the top 10 books that have sold the most copies
        const topBooks = await prisma.book.findMany({
          orderBy: {
            copies: 'desc',
          },
          take: 10,
        });

        res.status(200).json(topBooks); // Send the list of top books as a JSON response with status 200 (OK)
      } else if (rating) {
        // Retrieve books with rating higher or equal to the passed rating value
        const ratedBooks = await prisma.book.findMany({
          where: {
            rating: {
              gte: parseFloat(rating as string),
            },
          },
        });

        res.status(200).json(ratedBooks); // Send the list of books as a JSON response with status 200 (OK)
      } else {
        // Retrieve books based on genre
        const books = await prisma.book.findMany({
          where: genre ? { genre: genre as string } : undefined,
        });

        res.status(200).json(books); // Send the list of books as a JSON response with status 200 (OK)
      }

    } 
    
    catch (error) 
    {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  else if (req.method === 'PUT' || req.method === 'PATCH') 
    {
    try 
    {
      const { discountPercent, publisher } = req.body;

      if (!discountPercent || !publisher) {
        return res.status(400).json({ error: 'Discount percent and publisher are required' });
      }

      const discount = parseFloat(discountPercent as string) / 100;

      await prisma.book.updateMany({
        where: {
          publisher: publisher as string,
        },
        data: {
          price: {
            multiply: 1 - discount,
          },
          discount: discount * 100, // Update the discount field
        },
      });

      res.status(204).end(); // No content response
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  else 
  {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/*
http://localhost:3000/api/books?genre=Fiction
http://localhost:3000/api/books
http://localhost:3000/api/books?topSellers=true
http://localhost:3000/api/books?rating=4.5
*/

/*
npx prisma db push
npx prisma generate
npx prisma studio
npx prisma migrate dev
./start-database.sh
*/