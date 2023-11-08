document.addEventListener('DOMContentLoaded', () => {
	const apiKey = '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';

	let selectedImageNumber = null;

	const app = document.createElement('div');
	app.id = 'app';
	app.className = 'container';

	const titleText = document.createElement('h1');
	titleText.innerText = 'Tasio AI Image Generator';

	const subtitleText = document.createElement('p');
	subtitleText.innerText =
		'Best Quality, Masterpiece. Exceptional Detail, High-Resolution 4K, Ultra High Definition, Detailed Shadows, (Two Girls in Street Costume Selfies), Colorful Braids, Mixed Fujifilm, Cute, Laughter.';

	const maxImages = document.createElement('input');
	maxImages.type = 'number';
	maxImages.min = 1;
	maxImages.max = 200;
	maxImages.value = 4;
	maxImages.className = 'max-images';

	const countImages = document.createElement('p');
	countImages.innerText = maxImages.value;
	countImages.className = 'count-images';

	const input = document.createElement('input');
	input.id = 'user-prompt';
	input.type = 'text';
	input.placeholder = 'Enter a prompt here...';
	input.autofocus = true;

	const button = document.createElement('button');
	button.innerText = 'Generate';

	const result = document.createElement('div');
	result.className = 'result';

	const loading = document.createElement('div');
	loading.className = 'loading';
	loading.innerText = 'Generating...';

	const imageGrid = document.createElement('div');
	imageGrid.className = 'image-grid';

	const getRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const disableGenerateButton = () => {
		button.disabled = true;
	};

	const enableGenerateButton = () => {
		button.disabled = false;
	};

	const clearImageGrid = () => {
		imageGrid.innerHTML = '';
	};

	const generateImages = async (input) => {
		disableGenerateButton();
		clearImageGrid();

		result.style.display = 'flex';

		const imageUrls = [];

		for (let i = 0; i < maxImages.value; i++) {
			const randomNumber = getRandomNumber(1, 10000);
			const prompt = `${input} ${randomNumber}`;

			const response = await fetch(
				'https://api-inference.huggingface.co/models/prompthero/openjourney',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({ inputs: prompt }),
				},
			);

			if (!response.ok) {
				alert('Failed to generate image!');
			}

			const blob = await response.blob();
			const imgUrl = URL.createObjectURL(blob);
			imageUrls.push(imgUrl);

			const img = document.createElement('img');
			img.src = imgUrl;
			img.alt = `art-${i + 1}`;
			img.onclick = () => downloadImage(imgUrl, i);
			imageGrid.appendChild(img);
		}

		enableGenerateButton();

		loading.style.display = 'none';
		selectedImageNumber = null;
	};

	input.addEventListener('keyup', (event) => {
		if (event.key === 'Enter') {
			generateImages(input.value);
		}
	});

	button.addEventListener('click', () => {
		generateImages(input.value);
	});

	const downloadImage = (imgUrl, imageNumber) => {
		const link = document.createElement('a');
		link.href = imgUrl;
		link.download = `image-${imageNumber + 1}.jpg`;
		link.click();
	};
	app.appendChild(titleText);
	app.appendChild(subtitleText);
	app.appendChild(maxImages);
	app.appendChild(input);
	app.appendChild(button);
	result.appendChild(loading);
	result.appendChild(imageGrid);
	app.appendChild(result);

	document.body.appendChild(app);
});
