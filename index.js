const http = require('http');
const fs = require('fs');

const mimeTypes = {
	html: 'text/html',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	js: 'text/javascript',
	css: 'text/css',
};

const server = http.createServer((req, res) => {
	if (req.url === '/') {
		sendFile(res, 'index.html', 'html');
	} else {
		const fileExtension = getFileExtension(req.url);
		if (fileExtension) {
			const contentType = mimeTypes[fileExtension];
			if (contentType) {
				sendFile(res, '.' + req.url, contentType); // Hier wird der Pfad angepasst.
			} else {
				sendNotFound(res);
			}
		}
	}
});

function sendFile(res, fileName, contentType) {
	res.writeHead(200, { 'Content-Type': contentType });
	fs.createReadStream(fileName).pipe(res);
}

function sendNotFound(res) {
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end('Not Found');
}

function getFileExtension(url) {
	const match = url.match(/\.(js|css)/);
	return match ? match[1] : null;
}

server.listen(3000, () => {
	console.log('Server is running on port 3005');
});
