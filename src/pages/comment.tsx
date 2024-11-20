import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";


const Comment: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [comment, setComment] = useState<string | null>(null);
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
    data: commentList,
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchCommentList
} = api.comment.getCommentList.useQuery(
    { bookId: selectedBookId as string },
    { enabled: !!selectedBookId }
);

const createCommentMutation = api.comment.createComment.useMutation({
    onSuccess: () => {
        setSuccessMessage("Comment created successfully!");
        refetchCommentList();
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


const handleCreateComment = () => {
    if(!selectedBookId){
        setErrorMessage("Please select a book to leave a comment on.");
        return;
    }
    if(!session?.user?.id){
        setErrorMessage("Log in to submit a comment.");
        return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  
    createCommentMutation.mutate({
        bookId: selectedBookId,
        userId: session.user.id,
        content: comment as string,
    });
    
    
   
};
return (
    <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Create a Comment for a Book</h2>

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
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Comment:
                </label>
                <input
                    type="text"
                    id="comment"
                    value={comment ?? ""}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                    onClick={handleCreateComment}
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Create Comment
                </button>
            </div>
        )}

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        {selectedBookId && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Comment List</h3>
                {commentList?.commentList.length ? (
                    commentList.commentList.map((comment) => (
                        <div key={comment.id}>
                            <p><strong>Posted By: </strong>{comment.user.username}</p>
                            <p>{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p>There are no comments for this book.</p>
                )}
            </div>
        )}
    </div>
);
};

export default Comment;
