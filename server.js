const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  db.all('SELECT * FROM siswa', (err, rows) => {
    res.render('table', { rows });
  })
});

app.get('/add', (req, res) => {
  res.render('form', { item: {} });
})
app.post('/add', (req, res) => {
  const { name, height, weight, birthdate, isMarried } = req.body
  db.run("INSERT INTO siswa (name, height, weight, birthdate, isMarried) VALUES (?, ?, ?, ?, ?)", [name, height, weight, birthdate, isMarried == "" ? null : JSON.parse(isMarried)], (err) => {
    if (err) {
      console.log("gagal menambah data", err)
    }
    res.redirect('/')
  })
})

app.get('/edit/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM siswa WHERE id = ?", [id], (err, item) => {
    if (err) console.log(err)
    res.render('form', {item})
  })
})

app.post('/edit/:id', (req, res) => {
  const id = req.params.id
  const { name, height, weight, birthdate, isMarried } = req.body
  db.run("UPDATE siswa SET name = ?, height = ?, weight = ?, birthdate = ?, isMarried = ? WHERE id = ?",
    [name, height, weight, birthdate, isMarried == "" ? null : JSON.parse(isMarried), id], (err) => {
      if (err) console.log("gagal update data", err)
      res.redirect('/')
    })
})

app.get('/delete/:id', (req, res) => {
  const id = req.params.id
  db.run('DELETE FROM siswa WHERE id = ?', [id], (err) => {
    if (err) console.log(err)
    res.redirect('/')
  })
})

app.listen(3000);