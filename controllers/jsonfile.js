const handleJsonFile = (req, res) => {
    const { file } = req.files
    console.log(file)
    console.log(file.data.toString().substring(0,30))
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}