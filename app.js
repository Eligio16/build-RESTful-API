//Dependencias
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

//Defiendo la aplicacion de express
const app = express();

//Render para los template EJS
app.set('view engine', 'ejs');

//Manejo del DOM desde Node
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Uso de archivos locales en carpeta public
app.use(express.static("public"));

//Conectando a la base de datos
main().catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

//Esquema
const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
});

//Modelo de conexion
const Article = mongoose.model('Article', wikiSchema);

//Metodo GET y consulta todos los documentos de tipo article
app.get('/articles', (req, res) => {
    Article.find((err, foundArticles) => {
        if(!err){
            res.send(foundArticles);
        } else{res.send(err)}
    });
});

//Metodo POST - Inserta nuevos documentos en la BD
app.post('/articles', (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err){
            res.send('Guardado con exito')
        } else {res.send(err)}
    });
});

//Metodo DELETE - Elimina todos los documentos en la BD
app.delete('/articles', (req, res) => {
    Article.deleteMany((err) => {
        if (!err){
            res.send('Succesfully deleted all articles.')
        } else {res.send(err)}
    })
});

//Correr el server en el puerto 3k
app.listen(3000, () => console.log('Server running on port 3000'));