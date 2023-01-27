const Complaint = require('../models/Complaint');

exports.list = async (req, res) => {
    console.log(req.session);
    try {

    
        const totalComplaints = await Complaint.find({}).count();
        const employeeCountSummaryRef = await Complaint.aggregate(
            [
                { $match: { employeeID: { $ne: null } } },
                {
                    $group: {
                        _id: "$employee_id",
                        total: { $sum: 1 }
                    }
                }]);

        const employeeCountSummary = employeeCountSummaryRef.map(e => ({ name: e._id, total: e.total }));
        res.render("index", { employeeCountSummary: employeeCountSummary, totalComplaints: totalComplaints, totalEmployees: employeeCountSummary.length});

    } catch (e) {
        console.log(e);
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}