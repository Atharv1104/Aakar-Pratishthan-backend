

const errorHandler=(err,req,res,next)=>{
    console.error(err.stack);
    if (err.name === 'ValidationError') {
            return res.status(404).json({
                message: 'Please check information and try again',
                errors: Object.values(err.errors).map(e => e.message)
            })
        }
    if(err.name==='CastError'){
            return res.status(400).json({
                message:'Invalid Event id',
                
            })
        }
        return res.status(500).json({
            message:'Server error please try again later'
        })
}
export default errorHandler