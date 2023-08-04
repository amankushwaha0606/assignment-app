const authorize=(permittedRoles)=>{
    return(req,res,next)=>{
        console.log(req.role)
        if(permittedRoles.includes(req.role)){
            next()
        }else{
            res.send("unauthorized")
        }
    }
}

module.exports={
    authorize
}