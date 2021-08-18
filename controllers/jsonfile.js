const handleJsonFile = (req, res, JSON) => {
    const { file } = req.files
    // const filteredString = file.data.toString().replace('[', "").replace(']', "").split(',')
    // console.log(filteredString[0], filteredString[1], filteredString[2])
    const ari = JSON.parse(data.toString())
    console.log(ari)
    console.log(ari[0])
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}