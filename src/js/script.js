document.addEventListener('DOMContentLoaded', () => {
	const getApiKey = () => {
		const app = document.createElement('div');
		app.id = 'app';
		app.className = 'container';

		const titleText = document.createElement('h1');
		titleText.innerText = 'Tasio AI Image Generator';
		const inputContainer = document.createElement('div');
		inputContainer.className = 'row mt-5';
		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your API key here...';
		input.autofocus = true;
		input.className = 'col-12 col-md-6';
		const button = document.createElement('button');
		button.innerText = 'Submit';
		button.className = 'col-12 col-md-6';
		const errorMessage = document.createElement('p');
		errorMessage.className = 'errorMessage';
		button.onclick = async () => {
			const res = await checkKey(input.value);
			if (res == true) {
				setCookie('apiKey', input.value, 365);
				location.reload();
			} else {
				input.className = 'error';
				errorMessage.innerText = res.error;
				errorMessage.style.display = 'block';
			}
		};

		input.addEventListener('keyup', (event) => {
			input.className = '';
			errorMessage.style.display = 'none';
		});

		inputContainer.appendChild(input);
		input.after(errorMessage);
		inputContainer.appendChild(button);
		app.appendChild(titleText);
		app.appendChild(inputContainer);
		document.body.appendChild(app);
	};

	const apiKey = getCookie('apiKey');
	if (!apiKey) {
		getApiKey();
		return;
	}

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
		loading.style.display = 'block';

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
		if (event.key === 'Enter' && button.disabled) {
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

// check key
const checkKey = async (apiKey) => {
	try {
		const response = await fetch(
			'https://api-inference.huggingface.co/models/prompthero/openjourney',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);
		if (response.ok) {
			return true;
		} else {
			return await response.json();
		}
	} catch (error) {
		return error;
	}
};

// cookie
const setCookie = (cname, cvalue, exdays) => {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

const getCookie = (cname) => {
	let name = cname + '=';
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
};

const deleteCookie = (cname) => {
	document.cookie = cname + '=;expires=Thu, 01 Jan 1970';
};
