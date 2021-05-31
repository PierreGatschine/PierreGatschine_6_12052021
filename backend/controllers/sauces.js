/** @format */

const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  // convert body req data (data-form) into object
  const sauceObject = JSON.parse(req.body.sauce); 
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // counter to zero
    likes: 0,
    dislikes: 0,
  });
  sauce
    // mongoose method to save Sauce in database in collection Sauces
    .save() 
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  // update sauce with a file ?
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        // if get req.body.sauce object and generate imageUrl of new image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //else if do a copy of req.body
      { ...req.body }; 
  Sauce.updateOne(
    // update Sauce with req params id and give same id
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // get the filename from imageUrl
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // delete image from images folder with method of node package "file system"
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    // returns all Sauces in database
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like == 0) {
        sauce.usersLiked = sauce.usersLiked.filter(function (value) {
          // delete userId if usersLiked array contains it
          return value !== req.body.userId;
        });
        sauce.usersDisliked = sauce.usersDisliked.filter(function (value) {
          // delete userId if usersDisliked array contains it
          return value !== req.body.userId;
        });
      }
      if (req.body.like == 1) {
        // put userId in usersLiked array
        sauce.usersLiked.push(req.body.userId);
      }
      if (req.body.like == -1) {
        // put userId in usersDisliked array
        sauce.usersDisliked.push(req.body.userId);
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      sauce
        .save()
        .then(() =>
          res.status(201).json({ message: "Like/dislike enregistré !" })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
