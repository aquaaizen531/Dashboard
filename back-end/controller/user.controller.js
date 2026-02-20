const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const userLogModel = require("../model/userLogModel");
const passmodel = require("../model/pass.model");
const crypto = require("crypto");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      res.status(401).json({ message: "Incorrect password!" });
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      secret,
      { expiresIn: "12h" }
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // use after hosting and making the api https
      sameSite: "none",
      maxAge: 12 * 60 * 60 * 1000
    });
    const userLog = await userLogModel.findOne({ user: user.id });
    if (userLog) {
      await userLogModel.updateOne(
        { user: user._id },
        { $push: { actions: { action: "login", details: `logged in` } } }
      );
    } else {
      await userLogModel.create({
        user: user._id,
        actions: [
          {
            action: "login",
            details: "logged in"
          }
        ]
      });
    }
    await userModel.updateOne({ email: email }, { activityStatus: true });
    res.status(200).json({
      message: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.auth = async (req, res) => {
  res.status(200).json({ message: "authenticated" });
};
module.exports.getme = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.currentUser.id)
      .select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.presence = async (req, res) => {
  try {
    const id = req.currentUser.id;
    await userModel.updateOne({ _id: id }, { lastseen: new Date() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    if (users.length === 0) {
      res.status(401).json({ message: "couldn't find any users" });
    } else {
      const now = Date.now();
      const udata = users.map((u) => {
        const obj = u.toObject();
        return {
          ...obj,
          online: obj.lastseen
            ? now - new Date(obj.lastseen).getTime() < 40000
            : false
        };
      });
      res.status(200).json({ message: "users found", data: udata });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.adduser = async (req, res) => {
  try {
    const nuser = req.body;
    const existingUser = await userModel.findOne({ email: nuser.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const plainPassword = crypto.randomBytes(5).toString("hex");
    nuser.password = plainPassword;
    const newUser = await userModel.create(nuser);
    await passmodel.create({ user: newUser._id, pass: plainPassword });
    const allUsers = await userModel.find().select("-password");
    const { password, ...userWithoutPass } = newUser.toObject();
    const userlog = await userLogModel.findOne({ user: req.currentUser.id });
    if (userlog) {
      await userLogModel.updateOne(
        { user: req.currentUser.id },
        {
          $push: {
            actions: [
              {
                action: "created a new user",
                details: `Created user: name=${userWithoutPass.name},
                 email=${userWithoutPass.email},
                  role=${userWithoutPass.role},
                   status=${userWithoutPass.activityStatus}`
              }
            ]
          }
        }
      );
    } else {
      await userLogModel.create({
        user: req.currentUser.id,
        actions: [
          {
            action: "created a new user",
            details: `Created user: name=${userWithoutPass.name},
                 email=${userWithoutPass.email},
                  role=${userWithoutPass.role},
                   status=${userWithoutPass.activityStatus}`
          }
        ]
      });
    }
    res.status(200).json({
      message: "new user created",
      users: allUsers,
      pass: plainPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.edituser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const edits = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      location: data.location,
      role: data.role,
      activityStatus: data.activityStatus
    };
    const existingUser = await userModel.findById(id);
    let plainPassword = "";
    if (data.password && data.password.trim() !== "") {
      plainPassword = edits.password;
      const salt = await bcrypt.genSalt();
      edits.password = await bcrypt.hash(edits.password.toString(), salt);
    } else {
      delete edits.password;
    }
    const changedFields = {};
    const logDetails = Object.entries(changedFields)
      .map(([key, { from, to }]) => `${key}:"${from}"→"${to}" `)
      .join(", ");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      for (let i in edits) {
        if (edits[i] !== existingUser[i]) {
          changedFields[i] = {
            from: existingUser[i],
            to: edits[i]
          };
        }
      }
      await userModel.findByIdAndUpdate(id, edits);
      if (plainPassword) {
        await passmodel.updateOne({ user: id }, { pass: plainPassword });
      }
      const allUsers = await userModel.find().select("-password");
      const userlog = await userLogModel.findOne({ user: req.currentUser.id });
      if (userlog) {
        await userLogModel.updateOne(
          { user: req.currentUser.id },
          {
            $push: {
              actions: [
                {
                  action: "updated a user",
                  details: `${existingUser.email} updated with changes: ${logDetails}`
                }
              ]
            }
          }
        );
      } else {
        await userLogModel.create({
          user: req.currentUser.id,
          actions: [
            {
              action: "updated a user",
              details: `${existingUser.email} updated with changes: ${logDetails}`
            }
          ]
        });
      }
      res.status(200).json({
        message: "User updated successfully!",
        users: allUsers
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.profileupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const update = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password
    };
    let plainPassword = "";
    if (data.password && data.password.trim() !== "") {
      plainPassword = update.password;
      const salt = await bcrypt.genSalt();
      update.password = await bcrypt.hash(update.password.toString(), salt);
    } else {
      delete update.password;
    }
    const existingUser = await userModel.findById(id);
    await passmodel.updateOne({ user: id }, { pass: plainPassword });
    const changedFields = {};
    for (i in update) {
      if (update[i] !== existingUser[i]) {
        if (i !== "password") {
          changedFields[i] = {
            from: existingUser[i],
            to: update[i]
          };
        }
      }
    }
    const logDetails = Object.entries(changedFields)
      .map(([key, { from, to }]) => `${key}:"${from}"→"${to}" `)
      .join(", ");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      existingUser;
      await userModel.findByIdAndUpdate(id, update);
      const allUsers = await userModel.find().select("-password");
      const userlog = await userLogModel.findOne({ user: req.currentUser.id });
      if (userlog) {
        await userLogModel.updateOne(
          { user: req.currentUser.id },
          {
            $push: {
              actions: [
                {
                  action: "updated Profile",
                  details: `${existingUser.email} updated with changes: ${logDetails}`
                }
              ]
            }
          }
        );
      } else {
        await userLogModel.create({
          user: req.currentUser.id,
          actions: [
            {
              action: "updated a user",
              details: `${existingUser.email} updated with changes: ${logDetails}`
            }
          ]
        });
      }
      res.status(200).json({
        message: "Profile updated successfully!"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await userModel.findById(id);
    await userModel.findByIdAndDelete(id);
    const allUsers = await userModel.find().select("-password");
    const { password, ...existingUserWithoutPass } = existingUser.toObject();
    const userlog = await userLogModel.findOne({ user: req.currentUser.id });
    if (userlog) {
      await userLogModel.updateOne(
        { user: req.currentUser.id },
        {
          $push: {
            actions: {
              action: "deleted a user",
              details: `Created user: name=${existingUserWithoutPass.name},
               email=${existingUserWithoutPass.email},
                role=${existingUserWithoutPass.role},
                status=${existingUserWithoutPass.activityStatus}`
            }
          }
        }
      );
    } else {
      await userLogModel.create({
        user: req.currentUser.id,
        actions: [
          {
            action: "deleted a user",
            details: `Deleted user: name=${existingUserWithoutPass.name},
             email=${existingUserWithoutPass.email},
              role=${existingUserWithoutPass.role},
               status=${existingUserWithoutPass.activityStatus}`
          }
        ]
      });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully!", users: allUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.getpass = async (req, res) => {
  try {
    const id = req.currentUser.id;
    const user = await userModel.findById(id);
    if (user.role !== "admin") {
      res.status(401).json({ message: "UnAuthorised" });
    } else {
      const pass = await passmodel.find().populate().select("-password");
      res.status(200).json({ message: "success", data: pass });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
