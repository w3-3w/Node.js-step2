var express = require('express');
var router = express.Router();

// mongooseを用いてMongoDBに接続する
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todoList');

// ToDoスキーマを定義する
var Schema = mongoose.Schema;
var todoSchema = new Schema({
  isDone: {type: Boolean, default: false},
  content: String,
  createdDate: {type: Date, default: Date.now},
  limitDate: Date
});
var todoListSchema = new Schema({
  title: String,
  createdDate: {type: Date, default: Date.now},
  todos: [todoSchema]
});
mongoose.model('Todo', todoListSchema);
mongoose.model('TodoItem', todoSchema);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'ToDoリスト' });
});

/* GET todoList. */
router.get('/getList', function(req, res) {
  var Todo = mongoose.model('Todo');
  Todo.find({}, function(err, todos) {
    res.send(todos);
  });
});

/* POST todoList. */
router.post('/', function(req, res) {
  var title = req.body.title;
  if (title.length <= 30 && title.length > 0) {
    var Todo = mongoose.model('Todo');
    var todo = new Todo();
    todo.title = title;
    todo.todos = [];
    todo.save(function(err) {
      if (err) {
        res.send(false);
      }
      else {
        res.send(true);
      }
    });
  }
  else {
    res.send(false);
  }
});

/* GET todo page. */
router.get('/todo/:id', function(req, res) {
  var id = req.params.id;
  var Todo = mongoose.model('Todo');
  Todo.findOne({ _id: id }).select('title').exec(function(err, todo) {
    res.render('todo', { title: 'リスト - ' + todo.title, todoId: todo._id, todoTitle: todo.title });
  });
});

/* GET todo detail. */
router.get('/todo/list/:id', function(req, res) {
  var id = req.params.id;
  var Todo = mongoose.model('Todo');
  Todo.findOne({ _id: id }).select('todos').exec(function(err, todo) {
    res.send(todo);
  });
});

/* POST todo status. */
router.post('/todo/:id', function(req, res) {
  var id = req.params.id;
  var no = req.body.n;
  var Todo = mongoose.model('Todo');
  Todo.findOne({ _id: id }, function(err, todo) {
    var idx = 0;
    for (item in todo.todos) {
      if (todo.todos[item]._id == no) {
        idx = item;
        break;
      }
    }
    todo.todos[idx].isDone = ! (todo.todos[idx].isDone);
    todo.save(function(err) {
      if (err) {
        res.send(false);
      }
      else {
        res.send(true);
      }
    });
  });
});

/* POST todo detail. */
router.post('/todo/list/:id', function(req, res) {
  var id = req.params.id;
  var content = req.body.c;
  var date = req.body.d;

  var Todo = mongoose.model('Todo');
  Todo.findOne({ _id: id }).exec(function(err, todo) {
    todo.todos.push({ no: todo.seq, content: content, limitDate: date });
    todo.save(function(err) {
      if (err) {
        res.send(false);
      }
      else {
        res.send(true);
      }
    });
  });

});

/* GET search page. */
router.get('/search', function(req, res) {
  res.render('search', { title: '検索 - ToDoリスト' });
});

/* POST search result. */
router.post('/search', function(req, res) {
  var keyword = req.body.k;
  var Todo = mongoose.model('Todo');
  Todo.where('todos.content').regex(keyword)
      .sort('todos.createdDate')
      .exec(function(err, todos) {
        res.send(todos);
      });
})

module.exports = router;
