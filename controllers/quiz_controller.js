//el controlador importa el modelo para acceder a la BD
var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// controlador de index  GET /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
  }
).catch(function(error){next(error)});
};

// GET quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: [] })
})
};

// GET quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = "Incorrecta"
  if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
    resultado = "Correcta";
  }
  res.render('quizes/answer',{ quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(  // crea un objeto quiz
    { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema" }
  );
  res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST quizes/create con Validación
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz
  .validate()
  .then(
    function(err){
        if (err) {
          res.render('quizes/new', {quiz: quiz, errors: err.errors});
        } else {
          quiz // save: guarda en DB los campos pregunta y respuesta de quiz
          .save({fields: ["pregunta", "respuesta", "tema"]})
          .then( function(){ res.redirect('/quizes')})
        }      // res.redirect: Redirección HTTP a lista de preguntas
      }
    );
  };

  // GET quizes/:id/edit
  exports.edit = function(req, res) {
    var quiz = req.quiz;  //autoload de instancia de quiz
    res.render('quizes/edit', { quiz: quiz, errors: [] });
  };

  // PUT quizes/:id     update
  exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz
    .validate()
    .then(
      function(err){
          if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
          } else {
            req.quiz // save: guarda en DB los campos pregunta y respuesta de quiz
            .save( { fields: ["pregunta", "respuesta", "tema"] } )
            .then( function(){ res.redirect('/quizes'); });
          }      // res.redirect: Redirección HTTP a lista de preguntas
        }
      );
    };

    // DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

//  console.log("req.quiz.id: " + req.quiz.id);
