const handleJsonFile = async (req, res, fs, path) => {
    const { file } = req.files
    console.log(file)
    const savePath = path.join(__dirname, 'uploads', file.name)
    await file.mv(savePath)
    await fs.readFile(savePath, (err, data) => {
        if (err) { 
            res.json('failure')
        }
        else { 
            console.log(data)
        }
    })
    res.json('success')
}

module.exports = { 
    handleJsonFile: handleJsonFile
}