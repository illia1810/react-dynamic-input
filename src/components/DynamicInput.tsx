import React, { useState, useRef } from "react";
import { CloseIcon } from "../icons";

interface TagInputProps {
  suggestedTags: string[];
}

export const DynamicInput: React.FC<TagInputProps> = ({ suggestedTags }) => {
  const [content, setContent] = useState<(string | { tag: string })[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleCursorChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      insertAtCursor(inputValue);
      setInputValue("");
    }

    if (e.key === "Backspace" && inputValue === "") {
      const lastItem = content[content.length - 1];
      if (typeof lastItem === "object" && "tag" in lastItem) {
        setContent(content.slice(0, -1));
      }
    }
  };

  const insertTag = (tag: string) => {
    insertAtCursor({ tag });
    inputRef.current?.focus();
  };

  const insertAtCursor = (newItem: string | { tag: string }) => {
    const textBeforeCursor = inputValue.slice(0, cursorPosition);
    const textAfterCursor = inputValue.slice(cursorPosition);

    const updatedContent = [
      ...content,
      textBeforeCursor,
      newItem,
      textAfterCursor,
    ].filter(Boolean);
    setContent(updatedContent);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full border rounded p-2">
      <div className="flex flex-wrap items-center space-x-2 space-y-2">
        {content.map((item, index) =>
          typeof item === "string" ? (
            <span key={index} className="text-gray-800">
              {item}
            </span>
          ) : (
            <div
              key={index}
              className="flex items-center bg-gray-200 rounded-full px-3 py-1 space-x-2"
            >
              <span>{item.tag}</span>
              <button onClick={() => removeTag(index)} className="text-red-500">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          )
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleCursorChange}
          className="outline-none flex-grow"
          placeholder="Type here..."
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Suggested Tags:</h3>
        <div className="flex space-x-2">
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => insertTag(tag)}
              className="bg-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-400"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
