const userLogModel = require("../model/userLogModel");
const userModel = require("../model/user.model");

module.exports.logout = async (req, res) => {
  try {
    const id = req.currentUser.id;
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    await userModel.updateOne({ _id: id }, { activityStatus: false });
    await userLogModel.updateOne(
      { user: id },
      {
        $push: { actions: { action: "log out", details: "logged Out" } },
      },
    );
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.getLogs = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$actions" },
      {
        $project: {
          logId: "$_id",
          name: "$user.name",
          email: "$user.email",
          action: "$actions.action",
          details: "$actions.details",
          time: "$actions.createdAt",
        },
      },

      { $sort: { time: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const result = await userLogModel.aggregate(pipeline);

    const logs = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    res.status(200).json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
