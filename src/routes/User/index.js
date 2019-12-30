import express from 'express'
import bcrypt from 'bcryptjs'
import passport from 'passport'
require('../../auth')(passport)
const router = express.Router()
import User from '../../models/User'
import Storage from '../../models/Storage'
import hashPassword from '../../utils'
import generateToken from '../../utils'

router.post('/reset', async (req, res) => {


    try {
        let user = await User.deleteMany({})
        let storage = await Storage.deleteMany({})
        res.json({
            data: { user, storage },
            msg: "resetted successfully",
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


router.post('/usersignup', async (req, res) => {

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


router.post('/usersignin', async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    let user = await User.findOne({ email })
    if (!user) {
        let user = {}
        return res.json({
            data: user,
            msg: "",
            err: err,
            status: 500
        })
    } else {
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = generateToken(user)

            res.json({
                sucess: true,
                msg: 'authorized from now on',
                err: '',
                status: 200,
                token: token
            })


        } else {
            let user = {}
            return res.json({
                data: user,
                msg: "",
                err: err,
                status: 500
            })
        }
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


router.delete('/del/:_id', async (req, res) => {
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