<script>
	const SpeechRecognition =
		// @ts-ignore
		window.SpeechRecognition || window.webkitSpeechRecognition;

	const recognition = new SpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	let previousStartIndex = 0;
	let timeout = null;
	let startIndex = null;
	let started = false;

	export let main = true;
	export let words = [];
	export let timeoutLength = 2000;
	export let keyword = 'listen';
	export let callback = words => {};
	export const wordsAfterKeyword = () => startIndex ? words.slice(startIndex) : [];

	const createNewTimeout = () => {
		return setTimeout(() => {
			const action = words.slice(startIndex).join(' ');
			if (action.length > 0) callback(action);
			previousStartIndex = startIndex;
			startIndex = null;
		}, timeoutLength);
	};

	recognition.onresult = ({ results }) => {
		words = Array.from(results)
			.map(result => result[0].transcript)
			.map(t => t.replace(/[^\w\s]|_/g, ""))
			.map(t => t.replace(/\s+/g, " "))
			.map(t => t.toLowerCase().trim().split(' '))
			.flat();


		if (!startIndex) {
			let keywordIndex = words.indexOf(keyword, previousStartIndex);
			if (keywordIndex !== -1 ) {
				startIndex = keywordIndex + 1;
				timeout = createNewTimeout();
			}
		} else {
			clearTimeout(timeout);
			timeout = createNewTimeout();
		}
	};
</script>

<section class={main ? 'main' : ''}>
	<p>{startIndex ? words.slice(startIndex - 1).join(' ') : ''}</p>
	<button class={started ? startIndex ? 'listening' : 'waiting' : 'stopped'} on:click={() => {
		if (started) return
		started = true;
		recognition.start();
		}}>{started ? startIndex ? 'Listening...' : '"Hey DocTech, ..."' : 'Click to start listening'}</button>
</section>

<style>
@keyframes pulsing {
	from {
		transform: scale(1);
	}

	to {
		transform: scale(1.1);
	}
}

section {
	display: grid;
}

button {
	justify-self: center;
	align-self: center;
	border-radius: 50%;
	width: 20rem;
	aspect-ratio: 1/1;
	transition: width 0.2s, background-color 0.1s;
	box-shadow: 5px 5px 30px 1px rgba(121, 117, 147, 0.75);
	position: relative;
	border: none;
}

.listening {
	background-color: #56949f;
	animation: 1s cubic-bezier(0.07, -0.02, 1, 0.86) infinite alternate pulsing
}

.waiting {
	background-color: #9893a5;
}

.stopped {
	background-color: #b4637a;
}

section {
	transition: height 0.2s;
}

.main {
	height: 70vh;
}

.main button {
	width: 30rem;
}

</style>

