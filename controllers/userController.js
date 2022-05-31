const user = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//création de compte
exports.signup = (req, res, next) => {
    //cryptage du mot de passe pour ne pas le stocker en clair en BDD
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userSignup = new user({
                email: req.body.email,
                password: hash
            });
            userSignup.save()
                .then(() => {
                    console.log("ok");
                    res.status(201).json({ message: 'Utilisateur créé !' })
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//connexion
exports.login = (req, res, next) => {
    //je recupere user qui a le mail dans le body
    user.findOne({ email: req.body.email })
        .then(user => {
            //si je ne le trouve pas => alors j'affiche error
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //si je le trouve => je compare le mot de passe crypté en BDD avec celui passé dans le body et crypté
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si les mots de passes ne correspondent pas
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //Si iles correspondent, je génére le token d'accès
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
