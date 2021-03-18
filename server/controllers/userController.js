const { User } = require('../models')

class UserController {
    static enter(req, res){
        // console.log(req.body);
        const name = req.body.name
        User.findOrCreate({
            where : {
                name : name
            }
        })
        .then(data => {
            console.log(data);
            res.status(201).json({ name : data[0].name, message : `welcome ${name}`})
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

}

module.exports = UserController