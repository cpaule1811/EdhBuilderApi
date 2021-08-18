const handleJsonFile = (req, res) => {
    const { file } = req.files
    // const filteredString = file.data.toString().replace('[', "").replace(']', "").split(',')
    // console.log(filteredString[0], filteredString[1], filteredString[2])
    // const jsonObj = BJSON.stringify({ buf: file.data })
    const jsonString = file.data.toString()
    console.log(jsonString.substring(0,50))
    const jsonData = JSON.parse(jsonString)
    console.log(jsonData)
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}