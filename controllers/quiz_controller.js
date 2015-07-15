var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

//GET /quizes/search
exports.buscar = function(req, res) {	
	if( (req.query.search === undefined) || 
		(req.query.search.length === 0 ) ) {
		res.render('quizes/index', {quizes: 0});		
	} else {
		 // Sustituir blancos intercalados por carácteres comodín SQL "%"
		string = req.query.search.trim();
		string = string.replace(/\s+/g, ' ');
		string = string.replace(/\s/g, '%');
		string = '%' + string + '%';
	 // Buscar las preguntas que conengan las palabras seleccionads
	 // presentando el resultado en modo ascendente
		models.Quiz.findAll({ where: [ "pregunta like ?", string ]
							, order: [[ 'pregunta', 'ASC' ]] } )
			.then( function(quizes) {
			 // Mostrar la lista de preguntas según el criterio de búsqueda
				res.render('quizes/index', { quizes: quizes });    				
		}).catch(function(error) { next(error);})		
	} 
};

//GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
	if( (req.query.pregunta === undefined)  || 
		(req.query.respuesta === undefined) || 
		(req.query.pregunta.length === 0 )  ||
		(req.query.respuesta.length === 0 )
		) { 
			console.log('Server passed by line #76 ....');
			res.redirect('/quizes');		
		} else {
			console.log('New quiz added at line #79 ....');
		}			
		  var quiz = models.Quiz.build( req.body.quiz );
		
		// guarda en DB los campos pregunta y respuesta de quiz
		  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		    res.redirect('/quizes');  
		  })   // res.redirect: Redirección HTTP a lista de preguntas

};