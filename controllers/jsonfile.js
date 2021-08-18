const handleJsonFile = (req, res, fs) => {
    const { file } = req.files
    fs.readFile(file.name, (err, data) => {
        if (err){ 
            console.log(err)
        }
        else { 
            console.log(data[0])
        }
    })
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}