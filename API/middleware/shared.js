const pagination = (req,res,next) =>{
    let limit = parseInt(req.body.limit);
    let page = parseInt(req.body.page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    res.startIndex = startIndex;
    res.endIndex = endIndex;
    next();
}
 
module.exports = { pagination };