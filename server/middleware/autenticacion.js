const jwt = require("jsonwebtoken");
/*
=====================
Verifica Token
=====================
*/
let verificaToken = (req, res, next) => {
    let token = req.get("token");

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "token no válido",
                },
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};
/*
=====================
Verifica Admin_Role
=====================
*/
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador",
            },
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole,
};