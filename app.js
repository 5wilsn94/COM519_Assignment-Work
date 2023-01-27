require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const Employee = require("./models/Employee");

const complaintController = require("./controllers/complaint");
const employeeController = require("./controllers/employee");
const homeController = require("./controllers/home");

const app = express();
app.set("view engine", "ejs");

const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running."
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
  global.employee = false;
  if (req.session.employeeID && !global.employee) {
    const employee = await Employee.findById(req.session.employeeID);
    global.employee = employee;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const employee = await Employee.findById(req.session.employeeID);
  if (!employee) {
    return res.redirect('/');
  }
  next()
}

app.get("/", homeController.list);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.employee = false;
  res.redirect('/');
})

app.get("/create-employee", (req, res) => {
  res.render("create-employee", { errors: {} });
});
app.post("/create-employee", employeeController.create);

app.get("/employees", employeeController.list);
app.get("/employees/delete/:id", employeeController.delete);
app.get("/employees/update/:id", employeeController.edit);
app.post("/employees/update/:id", employeeController.update);

app.get("/create-complaint", (req, res) => {
  res.render("create-complaint", { errors: {} });
});
app.post("/create-complaint", complaintController.create);
app.get("/update-complaint", complaintController.edit);
app.get("/complaints", complaintController.list);
app.get("/complaints/delete/:id", complaintController.delete);

app.get("/login", (req, res) => {
  res.render('login-employee', { errors: {} })
});
app.post("/login", employeeController.login);

app.listen(2020, () => {
  console.log(
    `App listening at http://localhost:${PORT}`,
  );
});
