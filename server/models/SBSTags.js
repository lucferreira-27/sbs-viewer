const mongoose = require("mongoose");

// Schema for section tags
const SectionTagSchema = new mongoose.Schema(
  {
    type: String,
    id: String,
    tags: [String],
    summary: String,
    characters: [String],
  },
  { _id: false }
);

// Schema for chapter tags
const ChapterTagSchema = new mongoose.Schema(
  {
    chapter: Number,
    page: Number,
    sections: [SectionTagSchema],
  },
  { _id: false }
);

// Main SBS Tags Schema
const SBSTagsSchema = new mongoose.Schema(
  {
    volume: {
      type: Number,
      required: true,
      unique: true,
    },
    summary: String,
    chapters: [ChapterTagSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SBSTags", SBSTagsSchema);
