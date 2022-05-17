const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};



exports.getAll = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.likeSauce = (req, res, next) => {
    //récupération de la sauce pour connaitre le nombre de like/dislike
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            let likes = sauce.likes;
            let usersLiked = sauce.usersLiked;
            let dislikes = sauce.dislikes;
            let usersDisliked = sauce.usersDisliked;
            //si l'utilisateur n'a pas encore liké
            if(req.body.like === 1){
                likes = likes+1;
                usersLiked.push(req.body.userId);
            }
            //si l'utilisateur n'a pas encore disliké
            else if(req.body.like === -1){
                dislikes = dislikes+1;
                usersDisliked.push(req.body.userId);
            }
            //si l'utilisateur avait déjà liké ou disliké
            else {
                //suppression user de la liste des users qui ont like et on décremente nb like si on trouve le user dans le tab
                for (let i = 0; i < usersLiked.length; i++) {
                    if (usersLiked[i] === req.body.userId) {
                        usersLiked.splice(i, 1);
                        likes = likes-1;
                    }
                }
                //suppression user de la liste des users qui ont dislike et on décremente nb dislike si on trouve le user dans le tab
                for (let i = 0; i < usersDisliked.length; i++) {
                    if (usersDisliked[i] === req.body.userId) {
                        usersDisliked.splice(i, 1);
                        dislikes = dislikes-1;
                    }
                }
            }
            Sauce.updateOne({ _id: req.params.id }, { likes: likes,usersLiked : usersLiked, dislikes: dislikes, usersDisliked: usersDisliked})
                .then(() =>{
                    res.status(200).json({ message: 'Objet modifié !'})
                })
                .catch(error => res.status(400).json({ error }));
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

