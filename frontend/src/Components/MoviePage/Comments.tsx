import React, { useEffect, useState } from 'react';
import AddComment from './AddComment';
import { Comment } from '../../types';
import commentsData from "../../utils/comments.json";

interface CommentsProps {
  movieId: string | undefined;
}

const Comments: React.FC<CommentsProps> = ({ movieId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!movieId) {
      return;
    }
    const movieComments = commentsData.filter(
      (comment) => comment.movie_id === movieId
    );

    setComments(movieComments);
  }, [movieId]);

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center text-quaternary">
      <h1 className="text-4xl font-bold">Comments</h1>
      <AddComment />
      <div className='p-4 flex flex-col gap-4 justify-between items-center'>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-2 bg-tertiary bg-opacity-50 rounded">
              <p>User: {comment.user?.name || "Bob"}</p>
              <p>Date: {comment.date}</p>
              <p>Comment: {comment.content}</p>
            </div>
          ))
        ) : (
          <div>No comments</div>
        )}
      </div>
    </div>
  );
}

export default Comments;