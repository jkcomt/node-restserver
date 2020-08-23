const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const {
    verificaToken,
    verificaAdminRole,
} = require("../middleware/autenticacion");

const bcrypt = require("bcrypt");
const _ = require("underscore");

app.get("/", function(req, res) {
    res.json("Hello World");
});

app.get("/usuario", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, "nombre email role estado google img")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                });
            }

            Usuario.countDocuments({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: count,
                });
            });
        });
});

app.post("/usuario", [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
            });
        }

        return res.json({ ok: true, usuario: usuarioDB });
    });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], function(
    req,
    res
) {
    let id = req.params.id;
    let body = _.pick(req.body, ["email", "nombre", "img", "role", "estado"]);

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err,
                });
            }

            res.json({
                id,
                usuario: usuarioDB,
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], function(
    req,
    res
) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    //findByIdAndUpdate eliminación lógica
    //findByIdAndRemove eliminación física
    Usuario.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Usuario no encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado,
            });
        }
    );
});

module.exports = app;