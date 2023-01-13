const https = require('https');
const { builtinModules } = require('module');

function getDownloadUrl() {
	const bulkDataUrl = "https://api.scryfall.com/bulk-data/oracle-cards";

	https.get(bulkDataUrl, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			const parsedData = JSON.parse(data);
			getBulkDataFile(data.download_uri);
		});
	})
}

function getBulkDataFile(fileDownloadUri) {
	https.get(fileDownloadUri, (res) => {
		const path = "../data/cards.json";
		const writeStream = fs.createWriteStream(path);

		res.pipe(writeStream);

		writeStream.on("finish", () => {
			writeStream.close();
			console.log("Download Completed");
		});
	});
}

module.exports = {
	getDownloadUrl: getDownloadUrl
}