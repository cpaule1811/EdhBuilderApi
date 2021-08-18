const handleJsonFile = (req, res) => {
    console.log(req.files)
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}