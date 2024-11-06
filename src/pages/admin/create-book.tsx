import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const CreateBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('')
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState<number | ''>(''); 
    const [publishedAt, setPublishedAt] = useState<Date | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();
  
    const createBook = api.book.createBook.useMutation({
      onSuccess: () => {
        void router.push('/admin'); 
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
      
      const publishedDate = publishedAt ?? new Date();
      createBook.mutate({ 
        isbn,
        title, 
        author, 
        publisher,
        description, 
        genre, 
        price: Number(price), 
        publishedAt: new Date()
       });
    };

    return (
      <form onSubmit={handleSubmit}>
        {}
        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Publisher" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
        <input 
          value={price} 
          onChange={(e) => setPrice(Number(e.target.value))} 
          placeholder="Price" 
          type="number" 
        />
        <input type="date" onChange={(e) => setPublishedAt(new Date(e.target.value))} />
        <button type="submit">Create Book</button>
        {error && <p>{error}</p>}
      </form>
    );
};
