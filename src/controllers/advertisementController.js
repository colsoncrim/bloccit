const adQueries = require("../db/queries.advertisement.js");

module.exports = {
    index(req, res, next) {
        adQueries.getAllAds((err, ads) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("advertisement/index", { ads });
            }
        })
    },
    new(req, res, next) {
        res.render("advertisement/new");
    },
    create(req, res, next) {
        let newAd = {
            title: req.body.title,
            description: req.body.description
        };
        adQueries.addAdvertisement(newAd, (err, ad) => {
            if (err || !ad) {
                console.log("AD:", ad);
                console.log("ERROR:", err);
                res.redirect(500, "/advertisement/new");
            } else {
                res.redirect(303, `/advertisement/${ad.id}`);
            }
        });
    },
    show(req, res, next) {
        adQueries.getAd(req.params.id, (err, ad) => {
            if (err || ad == null) {
                res.redirect(404, "/");
            } else {
                res.render("advertisement/show", { ad });
            }
        });
    },
    destroy(req, res, next) {
        adQueries.deleteAd(req.params.id, (err, ad) => {
            if (err) {
                res.redirect(500, `/advertisement/${ad.id}`)
            } else {
                res.redirect(303, "/advertisement")
            }
        });
    },
    edit(req, res, next) {
        adQueries.getAd(req.params.id, (err, ad) => {
            if (err || ad == null) {
                res.redirect(404, "/");
            } else {
                res.render("advertisement/edit", { ad });
            }
        });
    },
    update(req, res, next) {

        adQueries.updateAd(req.params.id, req.body, (err, ad) => {

            if (err || ad == null) {
                res.redirect(404, `/advertisement/${req.params.id}/edit`);
            } else {
                res.redirect(`/advertisement/${topic.id}`);
            }
        });
    }
}
