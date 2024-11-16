import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

//Initialize Prisma
const prisma = new PrismaClient();

//Handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) 
{
  //GET request to retrieve books based on genre, top sellers, or rating
  if (req.method === 'GET') 
    {
    try 
    {
      const { genre, topSellers, rating } = req.query;

      //check if topSellers query parameter is set to true
      if (topSellers)
         {
        //Retrieve the top 10 books that have sold the most copies
        const topBooks = await prisma.book.findMany({
          orderBy: {
            copies: 'desc',
          },
          take: 10,
        });

        // Send the list of top books as a JSON response with status 200 (OK)
        res.status(200).json(topBooks); 
      }
      
      //check if rating query parameter is set
      else if (rating)
         {
        // Retrieve books with rating higher or equal to the passed rating value
        const ratedBooks = await prisma.book.findMany({
          where: {
            rating: {
              gte: parseFloat(rating as string),
            },
          },
        });

        // Send the list of books as a JSON response with status 200 (OK)
        res.status(200).json(ratedBooks); 
      } else 
      {
        // Retrieve books based on genre
        const books = await prisma.book.findMany({
          where: genre ? { genre: genre as string } : undefined,
        });

        // Send the list of books as a JSON response with status 200 (OK)
        res.status(200).json(books); 
      }

    } 
    //Catch any errors and send a 500 (Internal Server Error) response
    catch (error) 
    {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  //PUT or PATCH request to update the price of books based on publisher
  else if (req.method === 'PUT' || req.method === 'PATCH') 
    {
      //Check if the request body is empty
    try 
    {
      //Check if the request body is empty
      const { discountPercent, publisher } = req.body;

      //Check if discountPercent and publisher are provided
      if (!discountPercent || !publisher) 
        {
          //Send a 400 (Bad Request) response with an error message
        return res.status(400).json({ error: 'Discount percent and publisher are required' });
      }

      //Parse the discount percentage to a float
      const discount = parseFloat(discountPercent as string) / 100;

      //Update the price of books based on the publisher
      await prisma.book.updateMany({
        where: {
          publisher: publisher as string,
        },
        data: {
          price: {
            multiply: 1 - discount,
          },
          //Update the discount field
          discount: discount * 100, 
        },
      });

      //No content response
      res.status(204).end(); 
    } 
    catch (error)
     {
      //Catch any errors and send a 500 (Internal Server Error) response
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  else 
  {
    //Send a 405 (Method Not Allowed) response with the allowed methods
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