const multer = require('multer');

//permet la gestion des images => affectation/suppression à une sauce

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        //stockage du fichier d'image en mettant le nom + la date
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');
