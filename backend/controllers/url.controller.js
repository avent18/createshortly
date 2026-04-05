import Url from "../Models/url.model.js";
import { encode } from "../utils/util.js";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL required" });
    }

    // Create first
    const newUrl = await Url.create({
      originalUrl,
      user: req.userId,
    });

    // Better shortCode generation
    const shortCode = encode(Date.now() + newUrl._id.getTimestamp().getTime());

    newUrl.shortCode = shortCode;
    await newUrl.save();

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      data: newUrl,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    const url = await Url.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) return res.status(404).send("Not found");

    res.redirect(url.originalUrl);

  } catch (err) {
    res.status(500).send("Server Error");
  }
};


export const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!url) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};