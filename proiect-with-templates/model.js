const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost/tasorDatabase');
mongoose.connection.on("error", (err) => {
    console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});


const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: String,
    password: String,
    id: String
});

const ticketsSchema = new Schema({
    name: String,
    deadline: Date,
    start_time: Date,
    description: String,
    status: Boolean,
    url_proof: String,
    id: String,
});

const categoriesSchema = new Schema({
    name: String,
    id: String,
    id_project: String,
    tickets: [ticketsSchema]
});

const projectsSchema = new Schema({
    title: String,
    description: String,
    deadline: Date,
    id: String,
});

const assignmentsSchema = new Schema({
    id_user: String,
    id_ticket: String,
});

const activitiesSchema = new Schema({
    id_ticket: String,
    id_User: String,
    operation: String,
});

const enrolledSchema = new Schema({
    id_user: String,
    id_project: String,
});




const UsersModel = mongoose.connection.model('Users', usersSchema)
const TicketsModel = mongoose.connection.model('Tickets', ticketsSchema);
const ProjectsModel = mongoose.connection.model('Projects', projectsSchema);
const CategoriesModel = mongoose.connection.model('Categories', categoriesSchema);
const AssignmentsModel = mongoose.connection.model('Assignments', assignmentsSchema);
const ActivitiesModel = mongoose.connection.model('Activities', activitiesSchema);
const EnrollmentsModel = mongoose.connection.model('Enrollments', enrolledSchema);

module.exports = {
    Users: UsersModel,
    Tickets: TicketsModel,
    Projects: ProjectsModel,
    Categories: CategoriesModel,
    Assignments: AssignmentsModel,
    Activities: ActivitiesModel,
    Enrollments: EnrollmentsModel,
    Mongoose:mongoose
}
