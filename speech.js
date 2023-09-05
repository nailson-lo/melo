var texttospeak = document.getElementById('texttospeak');
var range = document.createRange();
var voice;
var speechtext;
var firstBoundary;

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

function playpause() {
    if (speechSynthesis.paused)
        speechSynthesis.resume();
    else
        speechSynthesis.pause();
}

function speak(speechtext) {
    firstBoundary = true;

    utterance = new SpeechSynthesisUtterance(speechtext);
    utterance.voice = voice;
    utterance.volume = 0.7;
    utterance.pitch = 0.2;
    utterance.rate = 3;
    utterance.addEventListener('start', () => document.body.classList.add('speaking'));
    utterance.addEventListener('end', () => document.body.classList.remove('speaking'));
    utterance.addEventListener('error', () => document.body.classList.remove('speaking'));
    speechSynthesis.speak(utterance);
}

