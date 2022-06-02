const Sauce = require('../models/sauceModel');
const fs = require('fs');

//définition des méthode pour les sauces/interaction avec la BDD

exports.createSauce = (req, res, next) => {
    //récupérer la sauce dans le body
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
    //save() permet de sotocker un objet en BDD
    sauce.save()
        //then() => ce qui est exécuté après la requête API si succès
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        //catch => ce qui est exécuté après la reqête API si erreur
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    //findOne => récupère un élément qui correspond au param, ici l'id de la sauce
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
    //On recherche la sauce pour supprimer l'image correspondante
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
            //updateOne => mise à jour de l'élement qui a le param passé, ici l'id de la sauce et l'userId
            Sauce.updateOne({ _id: req.params.id, userId : sauceObject.userId}, { ...sauceObject, _id: req.params.id })
                .then(() => {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    //on supprime l'image si on a un nouveau fichier image
                    if(req.file){
                        fs.unlink(`images/${filename}`, () => {
                            console.log("image supprimé");
                        });
                    }
                    res.status(200).json({ message: 'Objet modifié !'})
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                //deleteOne => supprimer l'element qui a le param, ici l'id de la sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};



exports.getAll = (req, res, next) => {
    //find => récupère tout en BDD
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


