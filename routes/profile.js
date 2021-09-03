const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


router.get("/", async (req, res) => {
    try {

        // const test = new Profile({ username: 'test name' });
        // test.save(function (err) {
        // if (err) return handleError(err);
        // // saved!
        // });
        res.send({msg : "profile routes"})
    } catch (error) {
        res.status(403).send(error)
        console.log(error)
    }
});




module.exports = router
