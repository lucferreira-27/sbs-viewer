import React from "react";

import MessageBubble from "./MessageBubble";

function QAPair({ section, searchMode = false, searchTerm = "" }) {
  if (!section || section.type !== "q&a") {
    return null;
  }

  const { question, answer, images } = section;

  // Organize all messages in chronological order

  const messages = [
    // Initial question

    {
      author: question?.author,

      content: question?.text,

      type: "text",

      isOda: false,

      hasImage: false,
    },

    // Question images

    ...(images

      ?.filter((img) => img.type === "question")

      .map((img) => ({
        author: question?.author,

        content: img,

        type: "image",

        isOda: false,

        hasImage: true,
      })) || []),

    // Answer segments

    ...(answer?.segments?.map((segment) => ({
      author: segment.author || answer.author,

      content: segment.type === "text" ? segment.text : segment,

      type: segment.type,

      isOda: segment.author === "Oda",

      hasImage: segment.type === "image",
    })) || []),

    // Additional images

    ...(images

      ?.filter((img) => ["answer", "illustration"].includes(img.type))

      .map((img) => ({
        author: img.author || answer?.author,

        content: img,

        type: "image",

        isOda: answer?.author === "Oda",

        hasImage: true,
      })) || []),
  ].filter(Boolean);

  return (
    <div className={`space-y-8 ${searchMode ? "search-highlight" : ""}`}>
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          {...message}
          searchMode={searchMode}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}

export default QAPair;
