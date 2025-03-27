// components/QuickReplyButton.tsx
import { FC } from "react";

interface QuickReplyButtonProps {
  text: string;
  onClick: (message: string) => void;
}

const QuickReplyButton: FC<QuickReplyButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
      onClick={() => onClick(text)}
    >
      {text}
    </button>
  );
};

export default QuickReplyButton;
