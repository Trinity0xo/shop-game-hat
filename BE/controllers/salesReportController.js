const SalesReport = require("../models/SalesReport");
const asyncMiddleware = require("../middlewares/asyncMiddleware");

// ========== get sale report ========== //

const getSalesReports = asyncMiddleware(async (req, res, next) => {
  const startYear =
    parseInt(req.query.startYear) || new Date().getFullYear() - 1;
  const startMonth = parseInt(req.query.startMonth) || 1;
  const endYear = parseInt(req.query.endYear) || new Date().getFullYear();
  const endMonth = parseInt(req.query.endMonth) || 12;
  const startDate = new Date(startYear, startMonth - 1, 1);
  const endDate = new Date(endYear, endMonth, 0, 23, 59, 59, 999);
  const salesReports = await SalesReport.aggregate([
    {
      $match: { date: { $gte: startDate, $lte: endDate } },
    },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        totalSales: { $sum: "$totalSales" },
        numberOfOrder: { $sum: "$numberOfOrders" },
        totalUsers: { $sum: "$totalUsers" },
        totalProducts: { $sum: "$totalProducts" },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            format: "%Y-%m",
            date: {
              $toDate: {
                $concat: [
                  { $toString: "$_id.year" },
                  "-",
                  { $toString: "$_id.month" },
                  "-01",
                ],
              },
            },
          },
        },
        totalSales: 1,
        numberOfOrder: 1,
        totalUsers: 1,
        totalProducts: 1,
      },
    },
  ]);

  res.json({
    success: true,
    data: salesReports,
  });
});

module.exports = { getSalesReports };
