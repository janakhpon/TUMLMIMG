import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
const router = express.Router()
import User from '../../models/User'
import hashPassword from '../../utils'


router.get('/users', async (req, res) => {
    let users = await User.find()

    if (users) {
        res.json({
            data: users,
            msg: "fetching success",
            err: "",
            status: 200
        })
    } else {
        res.json({
            data: users,
            msg: "",
            err: "failed to fetch",
            status: 204
        })
    }

})


router.get('/user/:_id', async (req, res) => {
    let user = await User.find({ _id: req.params._id })

    if (user) {
        res.json({
            data: user,
            msg: "fetching success",
            err: "",
            status: 200
        })
    } else {
        res.json({
            data: user,
            msg: "",
            err: "failed to fetch",
            status: 204
        })
    }
})


router.post('/user', async (req, res) => {

    let password = await hashPassword(req.body.password)

    const dbuser = new User({
        ...req.body,
        password
    })

    try {
        let user = await dbuser.save()
        res.json({
            data: user,
            msg: "added user successfully",
            err: "",
            status: 200
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


router.post('/user/:_id', async (req, res) => {
    let userExist = await User.findOne({ _id: req.params._id })

    if (!userExist) {
        throw new Error("User not found")
    }

    let password = await hashPassword(req.body.password)

    const dbuser = {
        ...req.body,
        password
    }

    try {
        let user = await User.findOneAndUpdate({ _id: req.params._id }, dbuser, {
            upsert: true,
            new: true
        })
        res.json({
            data: user,
            msg: "updated user successfully",
            err: "",
            status: 200
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


router.delete('/del/:_id', (req, res) => {
    try {
        let user = await User.deleteOne({ _id: req.params._id })
        res.json({
            data: user,
            msg: "removed user successfully",
            err: "",
            status: 200
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

module.exports = router