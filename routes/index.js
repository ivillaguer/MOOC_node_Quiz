var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var creditsController = require('../controllers/credits_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/search', quizController.buscar);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/credits/author', creditsController.author);

module.exports = router;
