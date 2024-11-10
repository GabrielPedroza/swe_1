// /pages/admin/index.tsx

import { useState } from "react";
import { api } from "~/utils/api";

const AdminPage = () => {
    const createBook = api.book.createBook.useMutation();
    const [bookDetails, setBookDetails] = useState({
      isbn: "",
      title: "",
      description: "",
      price: 0,
      author: "",
      genre: "",
      publisher: "",
      publishedAt: undefined,
      copiesSold: 0,
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBookDetails({
        ...bookDetails,
        [name]: name === "price" || name === "yearPublished" || name === "copiesSold" ? +value : value,
      });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await createBook.mutateAsync(bookDetails);
        alert("Book created successfully!");
      } catch (error) {
        console.error("Failed to create book:", error);
        alert("Failed to create book. Please try again.");
      }
    };
    // Allows for admins to enter info about books. 
    return (
      <form onSubmit={handleSubmit}>
        <input name="isbn" placeholder="ISBN" onChange={handleInputChange} />
        <input name="title" placeholder="Book Name" onChange={handleInputChange} />
        <input name="description" placeholder="Description" onChange={handleInputChange} />
        <input name="price" placeholder="Price" type="number" onChange={handleInputChange} />
        <input name="author" placeholder="Author" onChange={handleInputChange} />
        <input name="genre" placeholder="Genre" onChange={handleInputChange} />
        <input name="publisher" placeholder="Publisher" onChange={handleInputChange} />
        <input name="publishedAt" placeholder="Published Date" type="date" onChange={handleInputChange} />
        <input name="copiesSold" placeholder="Copies Sold" type="number" onChange={handleInputChange} />
        <button type="submit">Add Book</button>
      </form>
    );
  };
  

export default AdminPage;
