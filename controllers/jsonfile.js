const handleJsonFile = (req, res) => {
    const { file } = req.files
    const filteredString = file.data.toString().replace('[', "").replace(']', "").split(',')
    console.log(filteredString[0], filteredString[1], filteredString[2])
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}