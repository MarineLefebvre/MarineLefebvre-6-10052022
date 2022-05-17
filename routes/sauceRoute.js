//ce fichier va uniquement permettre de faire le routing => il appelera la méthode API dans le controller

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauceController');

module.exports = router;

//Différence entre GET et POST :
//GET : transporte params dans url => ex /:id
//POST : transporte param dans le body

//récupérer tout les éléments
router.get('/', auth, sauceCtrl.getAll);

//Insérer un objet en base de données
router.post('/', auth, multer, sauceCtrl.createSauce);

//récupérer un objet spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce);

//mettre à jour un objet spécifique
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//supprimer un objet spécifique
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//mettre à jour like et dislike
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
