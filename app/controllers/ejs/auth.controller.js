const hashedPassword = require ('../../helper/HashPassword');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const UserModel = require ('../../models/user.model');

class AuthController {
  async checkAuth (req, res, next) {
    if (req.user) {
      next ();
    } else {
      return res.redirect ('/');
    }
  }

  async getWelcomePage(req, res) {
    try {
      res.render('index', {
        title: "Welcome To This Website"
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getLoginPage (req, res) {
    try {
      res.render ('login', {
        title: 'Login User',
      });
    } catch (error) {
      console.log (error);
    }
  }

  async getRegisterPage (req, res) {
    try {
      res.render ('register', {
        title: 'Registration Page',
      });
    } catch (error) {
      console.log (error);
    }
  }

  async registerUser (req, res) {
    try {
      const {name, email, phone, password} = req.body;
      // Perform registration logic here

      if (!name || !email || !phone || !password) {
        // Handle missing fields
        req.flash ('error', 'All fields are required.');
        return res.redirect ('/register');
      }
      const existingUser = await UserModel.findOne ({email});
      if (existingUser) {
        req.flash ('error', 'User already exists.');
        return res.redirect ('/register');
      }

      const hashedUserPassword = await hashedPassword (password);

      const newUser = new UserModel ({
        name,
        email,
        phone,
        password: hashedUserPassword,
      });
      const savedUser = await newUser.save ();

      if (savedUser && savedUser._id) {
        req.flash ('success', 'Registration successful. Please log in.');
        res.redirect ('/');
      } else {
        req.flash ('error', 'Registration failed. Please try again.');
        res.redirect ('/register');
      }
    } catch (error) {
      console.log (error);
      req.flash ('error', 'An error occurred. Please try again.');
      res.redirect ('/register');
    }
  }

  // USER AND ADMIN LOGIN
  async loginUser (req, res) {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        req.flash ('error', 'All fields are required.');
        return res.redirect ('/');
      }

      // Find user by email (can be user or admin)
      const user = await UserModel.findOne ({email});
      if (!user) {
        req.flash ('error', 'Invalid credentials.');
        return res.redirect ('/');
      }

      // Verify password
      const isMatch = await bcrypt.compare (password, user.password);
      if (!isMatch) {
        req.flash ('error', 'Invalid email or password.');
        return res.redirect ('/');
      }

      // Create payload
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // role can be "user" or "admin"
      };

      const token = jwt.sign (payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Set different cookies based on role
      if (user.role === 'admin') {
        res.clearCookie ('adminToken');
        res.cookie ('adminToken', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
          path: '/',
          maxAge: 3600000,
        });

        req.flash ('success', 'Admin login successful.');
        return res.redirect ('/admin-dashboard');
      } else {
        res.clearCookie ('userToken');
        res.cookie ('userToken', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
          path: '/',
          maxAge: 3600000,
        });

        req.flash ('success', 'User login successful.');
        return res.redirect ('/user-dashboard');
      }
    } catch (error) {
      console.error (error);
      req.flash ('error', 'An error occurred during login.');
      return res.redirect ('/');
    }
  }

  // async getUserDashboardPage (req, res) {
  //   try {
  //     res.render ('user-dashboard', {
  //       title: 'User Dashboard',
  //       data: req.user,
  //       successMessage: req.flash ('success'),
  //     });
  //     //   console.log (req.user);
  //   } catch (error) {
  //     console.log (error);
  //     req.flash ('error', 'An error occurred');
  //     res.redirect ('/');
  //   }
  // }

  // for admin logout
  async logoutAdmin (req, res) {
    try {
      res.clearCookie ('adminToken', {
        path: '/',
        sameSite: 'Strict',
      });
      req.flash ('success', 'Admin logged out.');
      return res.redirect ('/');
    } catch (e) {
      console.error ('Admin Logout Error:', e);
      req.flash ('error', 'Logout failed.');
      return res.redirect ('/');
    }
  }

  // for user logout
  async logoutUser (req, res) {
    try {
      res.clearCookie ('userToken', {
        path: '/',
        sameSite: 'Strict',
      });
      req.flash ('success', 'Logged out successfully.');
      return res.redirect ('/');
    } catch (e) {
      console.error ('User Logout Error:', e);
      req.flash ('error', 'Logout failed.');
      return res.redirect ('/');
    }
  }
}

module.exports = new AuthController ();
