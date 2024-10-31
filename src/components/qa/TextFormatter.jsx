import React from "react";

function TextFormatter({ text, searchMode = false, searchTerm = "" }) {
  if (text === "N/A") return <em className="text-gray-400">N/A</em>;

  const formatText = (text) => {
    // Handle wiki links
    text = text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      const [link, title] = p1.split("|");
      return `<a href="https://onepiece.fandom.com/wiki/${link}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline decoration-2 decoration-accent/30">${
        title || link
      }</a>`;
    });

    // Handle bold text
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-gray-900">$1</strong>'
    );

    // Handle emphasis/italics
    text = text.replace(
      /(\*|_)(.*?)\1/g,
      '<em class="text-gray-800 italic">$2</em>'
    );

    // Handle exclamation marks
    text = text.replace(
      /(!{2,})/g,
      '<span class="font-semibold text-gray-900">$1</span>'
    );

    // Handle question marks
    text = text.replace(
      /(\?{2,})/g,
      '<span class="font-semibold text-gray-900">$1</span>'
    );

    // Handle big text
    text = text.replace(
      /<big>(.*?)<\/big>/g,
      '<span class="text-lg font-bold">$1</span>'
    );

    // Add proper spacing after punctuation
    text = text.replace(/([.!?])([^\s"])/g, "$1 $2");

    // Highlight search terms if in search mode
    if (searchMode && searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, "gi");
      text = text.replace(
        regex,
        '<mark class="bg-accent/20 text-accent">$1</mark>'
      );
    }

    return text;
  };

  return (
    <span
      className="prose prose-gray max-w-none prose-strong:text-gray-900 prose-em:text-gray-800"
      dangerouslySetInnerHTML={{
        __html: formatText(text),
      }}
    />
  );
}

export default TextFormatter;
