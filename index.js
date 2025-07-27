import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


let todos = [
  { 
    id: 1, 
    task: "Buy groceries", 
    completed: false,
    priority: "High", 
    dueDate: "2025-08-01", 
    description: "Get milk, bread, eggs", 
    status: "Pending"
  },
  { 
    id: 2, 
    task: "Walk the dog", 
    completed: false,
    priority: "Medium", 
    dueDate: "2025-08-02", 
    description: "Evening walk", 
    status: "Pending"
  },
];


// home page = show all todos
app.get("/", (req, res) => {
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  res.render("home", { 
    incompleteTodos, 
    completedTodos 
  });
});

// show *Form to create new todo
app.get("/todos/new", (req, res) => {
  res.render("new");  
});

// handel form submission to add todo
app.post("/todos",(req,res)=>{
  const {task} = req.body;
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    priority: req.body.priority || null,
    dueDate: req.body.dueDate || null,
    description: req.body.description || null,
    completed: req.body.completed === "on"
  };
  todos.push(newTodo);

  res.redirect("/");
});

// show edit *Form
app.get("/todos/:id/edit", (req,res)=>{
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) {
    return res.status(404).send("Todo not found");
  }
  res.render("edit.ejs", { todo });
})

// handle update (for both checkbox and task edit)
app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (todo) {
    if (req.body.task !== undefined) {
      // Update from edit form
      todo.task = req.body.task;
      todo.priority = req.body.priority;
      todo.dueDate = req.body.dueDate;
      todo.description = req.body.description;
      todo.status = req.body.status;
    } else {
      // Update from checkbox form
      todo.completed = req.body.completed === "on";
    }
  }
  res.redirect("/");
});


// handles delete the todo
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id) ;
  todos = todos.filter(t => t.id !== id);
  res.redirect("/");
});

// view detail page 
app.get("/todos/:id",(req,res)=>{
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).send("todo not found");
  res.render("detail", {todo});
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
