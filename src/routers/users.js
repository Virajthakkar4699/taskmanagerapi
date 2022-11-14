const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/users");
const { sendWelcomeEmail, senddeletemail } = require("../emails/accounts");

router.post("/users", async (req, res) => {
  // console.log("testing");
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }

  // user
  //   .save()
  //   .then(() => {
  //     console.log(user);
  //     res.send(user);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error.message);
  //   });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findbyCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);

  // try {
  //   const users = await User.find({});
  //   res.status(200).send(users);
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperations = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperations) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
    // console.log(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   res.status(404).send("No user found to delete");
    // }
    await req.user.remove();
    senddeletemail(req.user.email, req.user.name);
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const upload = multer({
  // dest: "avatars",
  // limits: {
  //   fileSize: 1000000,
  // },
  // fileFilter(req, file, cb) {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //     return cb(new Error("Please upload the image"));
  //   }
  //   cb(undefined, true);
  // },
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatars) {
      throw new Error();
    }
    res.set("content-type", "image/jpg");
    res.send(user.avatars);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// router.get("/users/me/avatar", auth, async (req, res) => {
//   console.log(req.user);
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user || !user.avatars) {
//       throw new Error();
//     }
//     res.set("content-type", "image/jpg");
//     res.send(user.avatars);
//   } catch (error) {
//     console.log(req.user);
//     res.status(400).send(error.message);
//   }
// });

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatars = undefined;
  await req.user.save();
  res.send("Deleted");
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      //const _id = req.params._id;
      //const buffer = await sharp(req.file.buffer);
      //console.log(req.file.buffer);
      //const user = User.findByIdAndUpdate(_id, req.file.buffer, { new: true });
      //console.log(user);

      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatars = buffer;
      await req.user.save();
      res.send({
        data: "uploaded",
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
);

module.exports = router;
