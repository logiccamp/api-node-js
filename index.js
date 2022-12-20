// require express, import express
const { request } = require('express');
const express = require('express');
const Joi = require('joi');

// declare app as instance of express method
var app = express();
app.use(express.json())

var courses = [
    { id: 1, name: "Course 1" },
    { id: 2, name: "Course 2" },
    { id: 3, name: "Course 3" },
]
// routes
app.get("/", (req, res) => {
    res.send("Hello world");
})


app.get('/api/courses', (req, res) => {
    res.send(courses)
})
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID was not found')
    return  res.send(course);
})

app.post('/api/courses', function (req, res) {
    const { error, value } = validateCourse(res.body)
    if (error) {
       return res.status(400).send(error.details[0].message)
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course)
    res.send(courses)
})
app.put('/api/courses/:id', (req, res) => {
    const { error, value } = validateCourse(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    var course = courses.find(c => c.id === req.params.id);
    if (!course) {
        res.status(400).send("Course not found");
        return;
    }
    course.name = req.body.newname;
    res.status(200).send(courses)
})

app.delete('/api/courses/:id', (req, res) => {
    // get the id
    var course_id = parseInt(req.params.id);

    // find the course
    var course = courses.find(c => c.id === course_id);
    if (!course) return res.status(400).send("Course not found");

    // delete the course
    var index = courses.indexOf(course);
    courses.splice(index, 1)

    // return the course
    res.send(course)
})

function validateCourse(course) {
    let rules;
    rules = {
        name: Joi.string().min(3).required()
    }
    const validator = Joi.object(rules)
    return validator.validate(course)
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening : port ${port}...`)
})
