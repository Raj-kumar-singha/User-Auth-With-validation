const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Session = require('../models/session');

let Auth = function () {
  //! USER REGISTER
  this.createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate user input
      if (!(email && password && name)) {
        return res.status(400).send("All input is required");
      }

      // Check if user exists in our database
      const oldUser = await User.findOne({ email: email });
      if (oldUser) {
        return res.status(409).send("User Already Exists. Please Login");
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Return user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "An error occurred" });
    }
  };

  //! USER LOGIN
  this.login = async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        return res.status(400).send("All input is required");
      }

      // Validate if user exists in our database
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send("Invalid Credentials");
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send("Invalid Credentials");
      }

      // Create token
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "secret",
        {
          expiresIn: "24h",
        }
      );

      await Session.updateMany({ user: user._id }, { $set: { status: 'Expired' } })
      await Session.create({ user: user._id, token, status: 'Active' });

      res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "An error occurred" });
    }
  };
};

module.exports = new Auth();
