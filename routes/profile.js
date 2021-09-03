const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


router.get("/", async (req, res) => {
    res.send({ msg: "Get Your profile" });

});




module.exports = router
