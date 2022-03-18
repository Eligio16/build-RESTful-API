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

//App route - chain method
app.route('/articles')
.get((req, res) => {
    Article.find((err, foundArticles) => {
        if(!err){
            res.send(foundArticles);
        } else{res.send(err)}
    });
})
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err){
            res.send('Guardado con exito')
        } else {res.send(err)}
    });
})
.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err){
            res.send('Succesfully deleted all articles.')
        } else {res.send(err)}
    });
});

//App route chain for articles
app.route('/articles/:articleId')

.get((req, res) => {
    Article.findOne({title: req.params.articleId}, (err, foundArticle) => {
        if (foundArticle){
            res.send(foundArticle)
        } else {res.send('Not found match')}
    })
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleId}, 
        {title: req.body.title, content: req.body.content},
        (err, doc) => {
            if (err){
                res.send(err);
            } else {res.send('Documento actualizado' + doc)}
        });
})
.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleId},
        {$set: req.body},
        (err, doc) => {
            if (err){
                res.send(err);
            } else {res.send('Dato actualizado')}
        }
    )
})
.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleId},
        (err) => {
            if (!err){
                res.send('Deleteado con exito')
            } else {res.send(err)}
        }
    )
});

//Correr el server en el puerto 3k
app.listen(3000, () => console.log('Server running on port 3000'));