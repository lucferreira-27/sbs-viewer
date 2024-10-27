const mongoose = require("mongoose");

// Schema for individual segments in answers
const SegmentSchema = new mongoose.Schema(
  {
    type: String,
    text: String,
    author: String,
    url: String,
    caption: String,
  },
  { _id: false }
);

// Schema for questions and answers
const QASchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    question: {
      text: String,
      author: String,
    },
    answer: {
      author: String,
      segments: [SegmentSchema],
    },
  },
  { _id: false }
);

// Schema for sections within chapters
const SectionSchema = new mongoose.Schema(
  {
    type: String,
    id: String,
    message: String,
    text: String,
    images: [
      {
        caption: String,
        url: String,
      },
    ],
    question: {
      text: String,
      author: String,
    },
    answer: {
      author: String,
      segments: [SegmentSchema],
    },
  },
  { _id: false }
);

// Schema for chapters
const ChapterSchema = new mongoose.Schema(
  {
    chapter: Number,
    page: Number,
    sections: [SectionSchema],
  },
  { _id: false }
);

// Main SBS Schema
const SBSSchema = new mongoose.Schema(
  {
    volume: {
      type: Number,
      required: true,
      unique: true,
    },
    summary: String,
    chapters: [ChapterSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SBS", SBSSchema);
