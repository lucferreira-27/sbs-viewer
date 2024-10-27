const express = require("express");
const router = express.Router();
const SBS = require("../../SBS");
const SBSTags = require("../../SBSTags");

// Get all volumes
router.get("/volumes", async (req, res) => {
  try {
    const volumes = await SBS.find().select("volume summary").sort("volume");
    res.json(volumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific volume
router.get("/volumes/:volume", async (req, res) => {
  try {
    const volume = await SBS.findOne({ volume: req.params.volume });
    if (!volume) {
      return res.status(404).json({ message: "Volume not found" });
    }
    res.json(volume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get volume tags
router.get("/volumes/:volume/tags", async (req, res) => {
  try {
    const tags = await SBSTags.findOne({ volume: req.params.volume });
    if (!tags) {
      return res.status(404).json({ message: "Volume tags not found" });
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search by character
router.get("/search/character/:name", async (req, res) => {
  try {
    const tags = await SBSTags.find({
      "chapters.sections.characters": {
        $regex: new RegExp(req.params.name, "i"),
      },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search by tag
router.get("/search/tag/:tag", async (req, res) => {
  try {
    const tags = await SBSTags.find({
      "chapters.sections.tags": {
        $regex: new RegExp(req.params.tag, "i"),
      },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
