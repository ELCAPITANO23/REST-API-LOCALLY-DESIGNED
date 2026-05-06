//routes only. check out express documentation for more details https://expressjs.com/en/guide/routing.html
//know the use of let and const in JavaScript.

const express = require("express"); // its a funcion that returns express
const cors = require("cors"); // its a function that returns cors
const app = express(); // its an express instance(object) that renamed as app
const { getAllInterns, saveAllInterns } = require("./db"); //
const PORT = 3000; // port to run the server on

app.use(cors());

// middleware to read JSON body
app.use(express.json());


// test route to check if the connection to the json file is working
app.get("/", (req, res) => {
  // the first parameter is the current path/Route, the second parameter is a callback function that takes request and response objects as arguments
  res.send("REST API is running...");
});


//get all interns data ... http://localhost:3000/interns
app.get("/interns", (req, res) => {
  const interns = getAllInterns();
  res.json(interns);
});

app.get('/interns/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const interns = getAllInterns(); // or readData()

  const results = interns.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.country.toLowerCase().includes(q) ||
    i.email.toLowerCase().includes(q)
  );

  res.json(results);
});

//get intern by id ... http://localhost:3000/interns/1
app.get("/interns/:id", (req, res) => {
  const id = parseInt(req.params.id); // get the id from the url and convert it to a number
  const interns = getAllInterns();
  const intern = interns.find((i) => i.id === id); // find the intern with the given id
  if (intern) {
    res.json(intern);
  } else {
    res.status(404).json({ message: "Intern not found" });
  }
});

app.post("/interns", (req, res) => {
  // after the comma leave a space before the calling function
  const interns = getAllInterns();

  const newIntern = {
    id: interns.length + 1,
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    country: req.body.country,
    phone: req.body.phone,
    email: req.body.email,
  };

  interns.push(newIntern);
  saveAllInterns(interns);
  res
    .status(201)
    .json({ message: "Intern added successfully", intern: newIntern });
});



app.put("/interns/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const interns = getAllInterns();
  const internIndex = interns.findIndex((i) => i.id === id); //i is the current intern in the loop.
  // during the loop, it checks if the id of the current intern matches the id from the request parameters. 
  // If it finds a match, it returns the index of that intern in the array. 
  // If no match is found after checking all interns, it returns -1.
  if (internIndex !== -1) {
    interns[internIndex] = { ...interns[internIndex], ...req.body };
    saveAllInterns(interns);
    res.json({
      message: "Intern updated successfully",
      intern: interns[internIndex],
    });
  } else {
    res.status(404).json({ message: "Intern not found" });
  }
});



app.delete("/interns/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let interns = getAllInterns();
  const internIndex = interns.findIndex((i) => i.id === id);
  if (internIndex !== -1) {
    interns.splice(internIndex, 1);

    interns = interns.map((intern, index) => ({
            ...intern,
            id: index + 1 // reassign id starting from 1
        }));
    saveAllInterns(interns);
    res.json({ message: "Intern deleted successfully" });
  } else {
    res.status(404).json({ message: "Intern not found" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
