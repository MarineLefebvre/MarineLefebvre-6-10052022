//ce fichier va uniquement permettre de faire le routing => il appelera la méthode API dans le controller

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')

const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');

module.exports = router;

//Insérer un objet en base de données
router.get('/', auth, stuffCtrl.getAll);

//récupérer un objet spécifique
router.post('/', auth, multer, stuffCtrl.createSauce);

//mettre à jour un objet spécifique
router.get('/:id', auth, stuffCtrl.getOneSauce);

//supprimer un objet spécifique
router.put('/:id', auth, multer, stuffCtrl.modifySauce);

//récupérer l'ensemble des objets en BDD
router.delete('/:id', auth, stuffCtrl.deleteSauce);

module.exports = router;
