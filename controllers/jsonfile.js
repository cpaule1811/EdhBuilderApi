const handleJsonFile = (req, res) => {
    console.log(req.body)
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}