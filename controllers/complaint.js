const Complaint = require("../models/Complaint");
const bodyParser = require("body-parser");
const Employee = require("../models/Employee");

exports.list = async (req, res) => {
    const perPage = 10;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const message = req.query.message;

    try {
        const complaints = await Complaint.find({}).skip((perPage * page) - perPage).limit(limit);
        const count = await Complaint.find({}).count();
        const numberOfPages = Math.ceil(count / perPage);

        res.render("complaints", {
            complaints: complaints,
            numberOfPages: numberOfPages,
            currentPage: page,
            message: message
        });
    } catch (e) {
        res.status(404).send({ message: "cannot show complaints list" });
    }
};

exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const complaint = await Complaint.findById(id);
        if (!complaint) throw Error('Cannot find complaint')
        res.render('update-complaint', {
            complaint: complaint,
            id: id,
            errors: {}
        });
    } catch (e) {
        console.log(e)
        if (e.errors) {
            res.render('create-complaint', { errors: e.errors })
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
        const complaint = await Complaint.updateOne({ _id: id }, req.body);
        res.redirect('/complaints/?message=complaint has been updated');
    } catch (e) {
        res.status(404).send({
            message: 'couldnt find id ${id}.',
        });
    }
};

exports.create = async (req, res) => {
    try {

        await Complaint.create({
            employee_id: req.session.Employee.employeeID,
            store_number: req.body.store_number,
            time: req.body.time,
            complaint_type: req.body.complaint_type,
            description: req.body.description
        })

        res.redirect('/complaints/?message=complaint has been created')
    } catch (e) {
        res.render('create-complaint', { errors: e.errors })
        return;
    }
    return res.status(400).send({
        message: JSON.parse(e),
    });
};



exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Complaint.findByIdAndRemove(id);
        res.redirect("/complaints");
    } catch (e) {
        res.status(404).send({
            message: 'cannot delete record ${id}.',
        });
    }
};