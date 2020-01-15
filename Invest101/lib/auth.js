const jwt = require('jsonwebtoken')
var tokenKey = "Invest1011!2@3#4$5%" // server.js의 token과 일치시켜야 함
const authMiddleware = (req, res, next) => {
   const token = req.headers['x-access-token'] || req.query.token;
   console.error(token)
   if(!token) {
       return res.status(403).json({
           success: false,
           message: 'not logged in'
       })
   }
   const p = new Promise( //디코딩함수
       (resolve, reject) => {
           jwt.verify(token, tokenKey, (err, decoded) => {
               if(err) reject(err)
               resolve(decoded)
           })
       }
   )
   const onError = (error) => {
       console.log(error);
       res.status(403).json({
           success: false,
           message: error.message
       })
   }
   p.then((decoded)=>{
       req.decoded = decoded
       next()
   }).catch(onError)
}
module.exports = authMiddleware;