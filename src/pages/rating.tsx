import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";


const Rating: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const { bookId } = router.query;

const {
    data: book,
    isLoading: isLoadingBook,
    isError: isErrorBook,
} = api.book.getBooks.useQuery({page: 1, limit: 10});
    

const {
    data: averageRating,
    isLoading: isLoadingAverage,
    isError: isErrorAverage,
    refetch: refetchAverageRating
} = api.rating.getAverageRating.useQuery(
    { bookId: selectedBookId as string },
    { enabled: !!selectedBookId }
);

const {
    data: ratingList,
    isLoading: isLoadingRatings,
    isError: isErrorRatings,
    refetch: refetchRatingList
} = api.rating.getRatingList.useQuery(
    { bookId: selectedBookId as string },
    { enabled: !!selectedBookId }
);

const createRatingMutation = api.rating.createRating.useMutation({
    onSuccess: () => {
        setSuccessMessage("Rating created successfully!");
        refetchAverageRating();
        refetchRatingList();
    },
    onError: (error) => {
        setErrorMessage(error.message);
    },
});

useEffect(() => {
    if (!session?.user){
        router.push("/login");
    }
}, [session, router]);

if(isLoadingBook){
    return <p>Currently loading books. </p>;
}

if(isErrorBook){
    return <p>An error occured while loading the books. </p>
}

const handleCreateRating = () => {
    if(rating === null || rating < 1 || rating > 5){
        setErrorMessage("Please use a rating between 1 and 5 and try again.");
        return;
    }
    if(!selectedBookId){
        setErrorMessage("Please select a book to rate.");
        return;
    }
    if(!session?.user?.id){
        setErrorMessage("Log in to submit a rating.");
        return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  
    createRatingMutation.mutate({
        bookId: selectedBookId,
        userId: session.user.id,
        rating,
    });
    
    
   
};
return (
    <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Rate a Book</h2>

        <div className="my-4">
            <label htmlFor="book" className="block text-sm font-medium text-gray-700">
                Select Book:
            </label>
            <select
                id="book"
                value={selectedBookId || ""}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">Select a book</option>
                {book?.map((book: {id: string; title: string}) => (
                    <option key={book.id} value={book.id}>
                        {book.title}
                    </option>
                ))}
            </select>
        </div>

        {selectedBookId && (
            <div className="my-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Rating:
                </label>
                <input
                    type="number"
                    id="rating"
                    value={rating ?? ""}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min="1"
                    max="5"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                    onClick={handleCreateRating}
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Create Rating
                </button>
            </div>
        )}

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        {selectedBookId && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Average Rating</h3>
                {isLoadingAverage && <p>Currently loading average rating. </p>}
                {!isLoadingAverage && isErrorAverage && <p>Couldn't load the average rating.</p>}
                {averageRating?.averageRating ? (
                    <p>{averageRating.averageRating.toFixed(2)} / 5</p>
                ) : null}
            </div>
        )}

        {selectedBookId && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Rating List</h3>
                {isLoadingRatings && <p>Currently loading list of ratings. </p>}
                {!isLoadingRatings && isErrorRatings && <p>Couldn't load the list of ratings. </p>}
                {ratingList?.ratingList.length ? (
                    ratingList.ratingList.map((rating) => (
                        <div key={rating.id}>
                            <p><strong>Posted By: </strong>{rating.user.username}</p>
                            <p><strong>Date: </strong>{new Date(rating.ratingDate).toLocaleString()}</p>
                            <p>{rating.score}</p>
                        </div>
                    ))
                ) : null}
            </div>
        )}
    </div>
);
};

export default Rating;
