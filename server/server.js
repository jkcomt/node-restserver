require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.json('Hello World');
});

app.get('/usuario', function(req, res) {

    res.json('get Usuario');
});


app.post('/usuario', function(req, res) {

    let usuario = req.body;

    if (usuario.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombnre es necesario'
        });
    } else {
        res.json({ usuario });
    }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Usuario eliminado ${id}`);
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});