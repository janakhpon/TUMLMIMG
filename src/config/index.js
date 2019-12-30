if(process.env.NODE_ENV === 'production'){
    module.exports = require('./key-pro')
}else{
    module.exports = require('./key-dev')
}