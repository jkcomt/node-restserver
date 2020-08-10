/*
=====================
    PUERTO
=====================
*/
process.env.PORT = process.env.PORT || 3000;

/*
=====================
    ENTORNO
=====================
*/

process.env.NODE_ENV = process.env.NODE_ENV || "env";

/*
=====================
    BASE DE DATOS
=====================
*/

let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB =
        "mongodb+srv://strider:9RdfgjiJ77hM5PHT@cluster0.4vyjc.mongodb.net/cafe";
}

process.env.URLDB = urlDB;