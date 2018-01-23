
//Base do Setup da Aplicação:
 
/* Chamada das Packages que iremos precisar para a nossa aplicação */
var express     = require('express'); //chamando o pacote express
var app         = express(); //definção da nossa aplicação através do express
var bodyParser  = require('body-parser');  //chamando o pacote body-parser
var MongoClient = require('mongodb').MongoClient,assert = require('assert'); //cliente mongodb atlas
var cors = require('cors');
 
/** Configuração da variável 'app' para usar o 'bodyParser()'.
 * Ao fazermos isso nos permitirá retornar os dados a partir de um POST
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

 
/** Definição da porta onde será executada a nossa aplicação */
var port = process.env.PORT || 8000;

//uri de conexão com o mongo
var uri = "mongodb://admin:admin@cluster0-shard-00-00-thtfz.mongodb.net:27017,cluster0-shard-00-01-thtfz.mongodb.net:27017,cluster0-shard-00-02-thtfz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

 
//Rotas da nossa API:
//==============================================================
 
/* Aqui o 'router' irá pegar as instâncias das Rotas do Express */
var router  = express.Router();
 
/* Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api) */
router.get('/', function(req, res) {
    res.json({ message: 'Api funcionando' });
});
/* fazer login*/ 
router.post('/login', function(req, res) {
    console.log(req.body);
    var  email = req.body.email;
    var senha = req.body.senha;
    MongoClient.connect(uri, function (err, client) {
        if (err) throw err;
      
         db = client.db('test');
         console.log(db);
          db.collection('users').findOne({email:email,senha:senha},function(err,docs){
             resultado = docs;

             if(!err){
                 //console.log(resultado[0]._id);
                res.json({id:resultado._id});
             }
             else{
                 console.log("entrou");
                res.json({error:"erro ao logar"});
             }
             
          });
         
         client.close();
      }); 
});
router.post('/cadastrarusuario', function(req, res) {
    //console.log(req.body);

    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    var necessidadeEspecial = req.body.nespecial;
    var db;

    MongoClient.connect(uri, function (err, client) {
        if (err) throw err;
       
        db = client.db('test');
        console.log(db);
         db.collection('users').insertOne({
            nome:nome,
            email:email,
            senha:senha,
            nespecial: necessidadeEspecial   
        },function (err, result){

            //se não houver erro
             if(!err){
                res.json({inserido:"sucesso"});
             }
             else{
                res.json({inserido:"falha ao inserir"});
             }

        });
        
        client.close();
       
      }); 
    
});

router.post('/denuncias', function(req, res) {
    //console.log(req.body);

    let name = req.body.name;
    let email = req.body.email;
    let site = req.body.site;
    let problems = req.body.problems;
    let noAlt = req.body.noAlt;
    let menuInac = req.body.menuInac;
    let contrast = req.body.contrast;
    let noHeading = req.body.noHeading;
    let noLabels = req.body.noLabels;
    let noFeedback = req.body.noFeedback; 
    let verified = false;


    var db;

    MongoClient.connect(uri, function (err, client) {
        if (err) throw err;
       
        db = client.db('test');
        console.log(db);
         db.collection('denuncias').insertOne({
            name,
            email,
            site,
            problems,
            noAlt,
            menuInac,
            contrast,
            noHeading,
            noLabels,
            noFeedback,
            verified
        },function (err, result){
                console.log(result);
            //se não houver erro
             if(!err){
                res.json({inserido:"sucesso"});
             }
             else{
                res.json({inserido:"falha ao inserir"});
             }

        });
        
        client.close();
       
      }); 
    
});
router.get('/usuarios', function(req, res) {
    console.log(req.body);

    var db;
    var resultado = null;
    var resultado;
    
        MongoClient.connect(uri, function (err, client) {
            if (err) throw err;
          
            
             db = client.db('test');
             console.log(db);
              db.collection('users').find({}).toArray(function(err,docs){
                 resultado = docs;

                 if(!err){
                    res.json(resultado);
                 }
                 else{
                    res.json(resultado);
                 }
                 
              });
             
             client.close();
          }); 
        
});

router.get('/denuncias', function(req, res) {
    console.log(req.body);

    var db;
    var resultado = null;
    var resultado;
    
        MongoClient.connect(uri, function (err, client) {
            if (err) throw err;
          
            
             db = client.db('test');
             console.log(db);
              db.collection('denuncias').find({}).toArray(function(err,docs){
                 resultado = docs;

                 if(!err){
                    res.json(resultado);
                 }
                 else{
                    res.json(resultado);
                 }
                 
              });
             
             client.close();
          }); 
        
});
/* TODO - Definir futuras rotas aqui!!! */
 
/* Todas as nossas rotas serão prefixadas com '/api' */
app.use('/api', router);
 
//Iniciando o Servidor (Aplicação):
//==============================================================
app.listen(port);
console.log('Iniciando a aplicação na porta ' + port);