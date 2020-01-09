import fs from 'fs'
import rimraf from 'rimraf'
import express from 'express'
var passport = require('passport')
require('../../auth')(passport)
const router = express.Router()
import Storage from '../../models/Storage'

router.post('/reset', async (req, res) => {
    try {
        let storage = await Storage.deleteMany({})
        rimraf('./src/public/img/*', () => {
            res.json({
                data: storage,
                msg: "resetted successfully",
                err: "",
                status: 200
            })
        })
    } catch (err) {
        let user = {}
        res.json({
            data: user,
            msg: "",
            err: err,
            status: 500
        })
    }
})

router.get('/lists', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let lists = await Storage.find()
    if (lists) {
        res.json({
            data: lists,
            msg: "fetching success",
            err: "",
            status: 200
        })
    } else {
        let lists = {}
        res.json({
            data: lists,
            msg: "",
            err: "failed to fetch",
            status: 204
        })
    }
})

router.get('/privatelists', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let lists = await Storage.find({ user: req.user.id })
    if (lists) {
        res.json({
            data: lists,
            msg: "fetching success",
            err: "",
            status: 200
        })
    } else {
        let lists = {}
        res.json({
            data: lists,
            msg: "",
            err: "failed to fetch",
            status: 204
        })
    }
})

router.get('/list/:_id', async (req, res) => {
    let list = await Storage.find({ _id: req.params._id })
    if (list) {
        res.json({
            data: list,
            msg: "fetching success",
            err: "",
            status: 200
        })
    } else {
        res.json({
            data: list,
            msg: "",
            err: "failed to fetch",
            status: 204
        })
    }
})

router.post('/list', passport.authenticate("jwt", { session: false }), async (req, res) => {
    let d = new Date()
    let date = parseInt(d.getTime())
    let image = "/img/" + req.file.filename
    let mimetype = req.file.mimetype
    let user = req.user.id
    const dblist = new Storage({
        ...req.body,
        user,
        image,
        mimetype,
        date
    })
    try {
        let list = await dblist.save()
        res.json({
            data: list,
            msg: "added list successfully",
            err: "",
            status: 200
        })
    } catch (err) {
        let list = {}
        res.json({
            data: list,
            msg: "",
            err: err,
            status: 500
        })
    }

    console.log(req.file.filename)
    console.log(req.user.id)
})

router.post('/list/:_id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    let listExist = await Storage.findOne({ _id: req.params._id })
    if (!listExist) {
        let list = {}
        res.json({
            data: list,
            msg: "",
            err: "No Data Found!",
            status: 500
        })
    } else {
        if (`${listExist.user}` === `${req.user.id}`) {
            let d = new Date()
            let date = parseInt(d.getTime())
            let image = "/img/" + req.file.filename;
            let mimetype = req.file.mimetype;
            const dblist = {
                ...req.body,
                image,
                mimetype,
                date
            }
            try {
                let list = await Storage.findOneAndUpdate({ _id: req.params._id }, dblist, {
                    upsert: true,
                    new: true
                })
                res.json({
                    data: list,
                    msg: "updated list successfully",
                    err: "",
                    status: 200
                })
            } catch (err) {
                let list = {}
                res.json({
                    data: list,
                    msg: "",
                    err: err,
                    status: 500
                })
            }
        } else {
            let list = {}
            res.json({
                data: list,
                msg: "",
                err: "Unauthorized",
                status: 500
            })
        }
    }
})

router.delete('/remove/:_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let listdata = await Storage.findOne({ _id: req.params._id })
        if (listdata) {
            if (`${listdata.user}` === `${req.user.id}`) {
                let dir = `./src/public${listdata.image}`
                try {
                    fs.unlinkSync(dir);
                } catch (err) {

                }
                let list = await Storage.deleteOne({ _id: req.params._id })
                res.json({
                    data: list,
                    msg: "removed list successfully",
                    err: "",
                    status: 200
                })
            } else {
                let list = {}
                res.json({
                    data: list,
                    msg: "",
                    err: "Unauthroized!",
                    status: 500
                })
            }


        } else {
            let list = {}
            res.json({
                data: list,
                msg: "",
                err: "No Image Found!",
                status: 500
            })
        }

    } catch (err) {
        let list = {}
        res.json({
            data: list,
            msg: "",
            err: err,
            status: 500
        })
    }
})

module.exports = router