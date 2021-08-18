const handleJsonFile = (req, res, fs) => {
    const { file } = req.files
    console.log(file)
    var buf = Buffer.from(file.data)
    console.log(buf)
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}