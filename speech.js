var voice;

function populateVoiceList() {
    let voices = window.speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang === 'pt-BR')
        {
            voice = voices[i];
            return ;
        }
    }
    voice = voices[0];
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined)
    speechSynthesis.onvoiceschanged = populateVoiceList;

function stopSpeach() {
    speechSynthesis.cancel();
}

function speak (speechtext) {
    utterance = new SpeechSynthesisUtterance(speechtext.replace(/<[^>]*>?/gm, ' '));
    utterance.voice = voice;
    utterance.volume = 0.7;
    utterance.pitch = 0.2;
    utterance.rate = 2;
    utterance.addEventListener('start', () => document.body.classList.add('speaking'));
    utterance.addEventListener('end', () => document.body.classList.remove('speaking'));
    utterance.addEventListener('error', () => document.body.classList.remove('speaking'));
    speechSynthesis.speak(utterance);
}

