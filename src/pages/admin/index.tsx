import { useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { api } from "~/utils/api";

const AdminPage = () => {
  const [action, setAction] = useState<'createBook' | 'createAuthor' | null>(null);
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
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

  const createAuthor = api.author.createAuthor.useMutation({
    onSuccess: () => {
      void router.push('/admin');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      publishedAt: publishedDate,
    });
  };

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !biography || !publisher) {
      setError('All fields are required.');
      return;
    }

    createAuthor.mutate({
      firstName,
      lastName,
      biography,
      publisher,
    });
  };

  return (
    <div className="space-y-4">
      {/* Menu for buttons */}
      <div>
        <button
          onClick={() => setAction('createBook')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Book
        </button>
        <button
          onClick={() => setAction('createAuthor')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Author
        </button>
      </div>

      {/* Button for createBook */}
      {action === 'createBook' && (
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="ISBN"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="Publisher"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Genre"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            onChange={(e) => setPublishedAt(new Date(e.target.value))}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Book
          </button>
        </form>
      )}
      {/* Button for creating an author */}
      {action === 'createAuthor' && (
        <form onSubmit={handleAuthorSubmit} className="space-y-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Biography"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="Publisher"
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Author
          </button>
        </form>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AdminPage;


