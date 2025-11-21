
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const { sortBy, order, role } = req.query;


    const whereClause = {};
    if (role) whereClause.role = role;

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        [sortBy || 'name']: order === 'desc' ? 'desc' : 'asc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
           select: { rating: true }
        }
      }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};