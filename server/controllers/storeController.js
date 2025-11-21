
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await prisma.store.findFirst({ where: { email } });
    if (existing) return res.status(400).json({ error: "Store email already exists" });

    const store = await prisma.store.create({
      data: { name, email, address, ownerId }
    });

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      orderBy: {
        [sortBy || 'name']: order === 'desc' ? 'desc' : 'asc'
      },
      include: {
        owner: { select: { name: true, email: true } }
      }
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyStoreStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    });

    if (!store) return res.status(404).json({ error: "No store found for this user" });

    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};