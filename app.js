require('dotenv').config();
const express = require('express');
const db = require('./app/config/db');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const ejsAuthRoutes = require('./app/routers/ejs/auth.routes');
const ejsAdminRoutes = require('./app/routers/ejs/admin.routes');
const ejsUserRoutes = require('./app/routers/ejs/user.routes');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
     } 
}));

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/public"));


app.use(ejsAuthRoutes);
app.use(ejsAdminRoutes);
app.use(ejsUserRoutes);

app.listen(process.env.PORT, async () => {
    await db.connectDb();
    console.log('Server running on port '+ process.env.PORT + ' ...');
})