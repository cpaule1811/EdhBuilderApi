const BJSON = require('buffer-json')

const handleJsonFile = (req, res) => {
    const { file } = req.files
    // const filteredString = file.data.toString().replace('[', "").replace(']', "").split(',')
    // console.log(filteredString[0], filteredString[1], filteredString[2])
    const jsonObj = BJSON.stringify({ buf: file.data })
    console.log(ari)
    console.log(ari[0])
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}