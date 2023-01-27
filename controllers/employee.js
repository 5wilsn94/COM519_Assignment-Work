const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employee) {
            res.render('login-employee', { errors: { employeeID: { message: 'id not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, employee.password);
        if (match) {
            req.session.employeeID = employee._id;
            console.log(req.session.employeeID);
            res.redirect('/');
            return
        }

        res.render('login-employee', { errors: { password: { message: 'password does not match' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.list = async (req, res) => {
    try {
      console.log(req.query)
      const message = req.query.message;
      const employees = await Employee.find({});
      res.render("employees", { employees: employees, message: message });
    } catch (e) {
      res.status(404).send({ message: "could not list employees" });
    }
  };

exports.create = async (req, res) => {
    try {

        const employee = new Employee({ employeeID: req.body.employeeID, password: req.body.password });
        await employee.save();
        res.redirect('/?message=employee saved')
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('create-employee', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const employee = await Employee.findById(id);
        if (!employee) throw Error('Cannot find employee')
        res.render('update-employee', {
            employee: employee,
            id: id,
            errors: {}
        });
    } catch (e) {
        console.log(e)
        if (e.errors) {
            res.render('create-employee', { errors: e.errors })
            return;
        }
        res.status(404).send({
            message: 'couldnt find id ${id}',
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const employee = await Employee.updateOne({ _id: id }, req.body);
        res.redirect('/employees/?message=employee has been updated');
    } catch (e) {
        res.status(404).send({
            message: 'couldnt find id ${id}.',
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Employee.findByIdAndRemove(id);
        res.redirect("/employees");
    } catch (e) {
        res.status(404).send({
            message: 'cannot delete record ${id}.',
        });
    }
};