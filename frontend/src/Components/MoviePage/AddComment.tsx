import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddComment = () => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'inherit';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // ! TODO: Submit comment to backend
    console.log("Comment submitted")
  };

  return (
    <form onSubmit={handleCommentSubmit} className="w-full mt-4 flex flex-row justify-between items-center gap-4 px-4">
      <textarea
        value={comment}
        onChange={handleCommentChange}
        className="w-full h-20 outline-none p-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
        placeholder={t('addComment')}
        ref={textAreaRef}
        style={{ overflow: 'hidden', resize: 'none' }}
      />
      <button type="submit" className="h-8 w-8 shrink-0 rounded-full" style={{
        backgroundImage: `url('./src/assets/send.svg')`,
      }}>
      </button>
    </form>
  );
};

export default AddComment;