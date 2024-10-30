import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const CreateBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState<number | ''>(''); // Adjust type for price
    const [publishedAt, setPublishedAt] = useState<Date | null>(null); // Adjust for date input
    const [error, setError] = useState('');
    const router = useRouter();
  
    const createBook = api.book.createBook.useMutation({
      onSuccess: () => {
        router.push('/admin'); 
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Validate input
      if (!title || !author || !description || !genre || price === '') {
        setError('All fields are required.');
        return;
      }
  
      const session = await getSession();
      if (!session) {
        setError('You must be logged in to create a book.');
        return;
      }
  
      // FIXME: createBook.mutate({ title, author, description, genre, price: Number(price), publishedAt });
    };
  
   // return ();
}