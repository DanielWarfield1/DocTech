<script>
const SpeechRecognition =
  // @ts-ignore
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

let previousStartIndex = 0;
let timeout = null;
let startIndex = null;


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
