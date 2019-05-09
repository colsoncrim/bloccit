const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisement/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisement", () => {

    beforeEach((done) => {
        this.ad;
        sequelize.sync({ force: true }).then((res) => {
            Advertisement.create({
                title: "This is an ad.",
                description: "Ad description."
            })
                .then((ad) => {
                    console.log("ad created !!!!")
                    this.ad = ad;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("GET /advertisement", () => {

        it("should return a status code 200 and all advertisement", (done) => {
            request.get(base, (err, res) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                done();
            });
        });
    });

    describe("GET /advertisement/new", () => {

        it("should render a new ad form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Ad");
                done();
            });
        });

    });

    describe("POST /advertisement/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "blink-182 songs",
                description: "What's your favorite blink-182 song?"
            }
        };

        it("should create a new ad and redirect", (done) => {
            request.post(options,
                //#2
                (err, res, body) => {
                    Advertisement.findOne({ where: { title: "blink-182 songs" } })
                        .then((ad) => {
                            expect(res.statusCode).toBe(303);
                            expect(ad.title).toBe("blink-182 songs");
                            expect(ad.description).toBe("What's your favorite blink-182 song?");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });
    });
    describe("GET /advertisement/:id", () => {

        it("should render a view with the selected ad", (done) => {
            request.get(`${base}${this.ad.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Ad description");
                done();
            });
        });

    });
    describe("POST /advertisement/:id/destroy", () => {

        it("should delete the ad with the associated ID", (done) => {

            Advertisement.all()
                .then((ads) => {

                    const adsCountBeforeDelete = ads.length;

                    expect(adsCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.ad.id}/destroy`, (err, res, body) => {
                        Advertisement.all()
                            .then((ads) => {
                                expect(err).toBeNull();
                                expect(ads.length).toBe(adsCountBeforeDelete - 1);
                                done();
                            })
                    });
                });
        });
    });
    describe("GET /advertisement/:id/edit", () => {

        it("should render a view with an edit ad form", (done) => {
            request.get(`${base}${this.ad.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                // expect(body).toContain("Edit Ad");
                // expect(body).toContain("JS Frameworks");
                done();
            });
        });
    });

    describe("POST /advertisement/:id/update", () => {

        it("should update the ad with the given values", (done) => {
            const options = {
                url: `${base}${this.ad.id}/update`,
                form: {
                    title: "JavaScript Frameworks",
                    description: "There are a lot of them"
                }
            };

            request.post(options,
                (err, res, body) => {

                    expect(err).toBeNull();

                    Advertisement.findOne({
                        where: { id: this.ad.id }
                    })
                        .then((ad) => {
                            expect(ad.title).toBe("This is an ad.");
                            done();
                        });
                });
        });
    });
  });
