// src/Components/MoviePage/Comments.tsx

import React, { useEffect, useState } from "react";
import AddComment from "./AddComment";
import { CommentMovie } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/useAuth";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";

interface CommentsProps {
  movieId: number | undefined;
}

const Comments: React.FC<CommentsProps> = ({ movieId }) => {
  const { t } = useTranslation();
  const { userData } = useAuth();

  const [comments, setComments] = useState<CommentMovie[]>([]);

  useEffect(() => {
    if (!movieId) {
      return;
    }
    getComment();
  }, [movieId]);

  async function getComment() {
    try {
      const res: { results?: CommentMovie[] } = await fetchWrapper("api/comments/", { method: "GET" });
      if ("results" in res) {
        if (res["results"] != undefined && res["results"]?.length > 0) {
          setComments(res["results"]);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    getComment();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center text-quaternary">
      <h1 className="text-4xl font-bold">{t("comments")}</h1>
      {userData && Object.keys(userData).length > 0 && (
        <>
          <AddComment movieId={movieId} getComment={getComment} />
          <div className="p-4 flex flex-col gap-4 justify-between items-start">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-2 bg-tertiary bg-opacity-50 rounded">
                  <p>
                    {t("name")}: {comment.author || "Bob"}
                  </p>
                  <p>
                    {t("date")}: {comment.created_at}
                  </p>
                  <p>
                    {t("comment")}: {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div>{t("noComments")}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
