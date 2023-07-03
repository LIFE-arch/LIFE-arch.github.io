const handleSubmit = (event) => {
	event.preventDefault();

	const name = document.querySelector('#name').value;
	const age = document.querySelector('#age').value;
	const gender = [...document.querySelectorAll('input[name=gender]')].find((input) => input.checked)?.value;
	const weight = [...document.querySelectorAll('input[name=weight]')].find((input) => input.checked)?.value;
	const background = document.querySelector('#background').value;
	const condition = document.querySelector('#condition').value;

	const data = {
		mmseScore: parseFloat(document.querySelector('#mmse').value),
		cdrScore: parseInt(document.querySelector('#cdr').value),
		symptoms: {
			'Memory Loss': document.getElementById('memory-loss').checked,
			Confusion: document.getElementById('confusion').checked,
			Depression: document.getElementById('depression').checked,
			Agitation: document.getElementById('agitation').checked,
			Hallucinations: document.getElementById('hallucinations').checked,
		},
	};

	fetch('http://127.0.0.1:5000/diagnose', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((response) => {
			displayResult({ name, age, gender, weight, background, condition, ...response });
		})
		.catch((error) => console.log(error));
};

const form = document.querySelector('#form').addEventListener('submit', handleSubmit);

function displayResult(data) {
	const { diagnosis, dementiaRange, positiveSymptoms, name, age, gender, weight, background, condition } = data;

	document.querySelector('#form').classList.add('inactive');
	document.querySelector('#result').classList.add('active');
	window.scroll(0, 0);

	document.querySelector('#name-result').innerHTML = name || 'N/A';
	document.querySelector('#age-result').innerHTML = age || 'N/A';
	document.querySelector('#gender-result').innerHTML = gender || 'N/A';
	document.querySelector('#weight-result').innerHTML = weight || 'N/A';
	document.querySelector('#background-result').innerHTML = background || 'N/A';
	document.querySelector('#condition-result').innerHTML = condition || 'N/A';
	document.querySelector('#diagnosis-result').innerHTML = diagnosis || 'N/A';
	document.querySelector('#range-result').innerHTML = dementiaRange || 'N/A';
	document.querySelector('#result-symptoms').innerHTML =
		positiveSymptoms.length > 0
			? positiveSymptoms.reduce((prev, symptom) => (prev += `<div>${symptom}</div>`), '')
			: 'No positive symptoms reported.';
}

document.querySelector('#print').addEventListener('click', () => {
	window.print();
});

document.querySelector('#retake').addEventListener('click', () => {
	document.querySelector('#form').classList.remove('inactive');
	document.querySelector('#result').classList.remove('active');
	window.scroll(0, 0);

	document.querySelector('#form').reset();
});
