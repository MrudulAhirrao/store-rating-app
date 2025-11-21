
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user.id; 
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    await prisma.rating.upsert({
      where: {
        userId_storeId: { userId, storeId } 
      },
      update: { score },
      create: { userId, storeId, score }
    });

    const aggregations = await prisma.rating.aggregate({
      _avg: { score: true },
      where: { storeId }
    });

    const newAverage = aggregations._avg.score || 0;

    await prisma.store.update({
      where: { id: storeId },
      data: { rating: newAverage }
    });

    res.json({ message: "Rating submitted successfully", currentRating: newAverage });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
};