const getCurrentUser = async (req,res)=>{
    try {
        // we got sessionData from req.user (set from middleware)
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(500).json({message:`Error in getting current user - ${error}`})
    }
}

export default getCurrentUser