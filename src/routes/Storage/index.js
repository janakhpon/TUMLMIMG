import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
const router = express.Router()
import Storage from '../../models/Storage'


router.get('/lists', async (req, res) => {
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


router.post('/list', async (req, res) => {

    let d = new Date()
    let date = parseInt(d.getTime())
    let image = "/img/" + req.file.filename;
    let mimetype = req.file.mimetype;
    const dblist = new Storage({
        ...req.body,
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

})


router.post('/list/:_id', async (req, res) => {
    let listExist = await Storage.findOne({ _id: req.params._id })

    if (!listExist) {
        throw new Error("list not found")
    }

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
})


router.delete('/del/:_id', (req, res) => {
    try {
        let list = await Storage.deleteOne({ _id: req.params._id })
        res.json({
            data: list,
            msg: "removed list successfully",
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
})

module.exports = router