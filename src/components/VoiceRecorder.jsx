import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

export default function VoiceRecorder({setAnswer}) {

const { transcript, listening } = useSpeechRecognition()

const start = () => SpeechRecognition.startListening({continuous:true})
const stop = () => SpeechRecognition.stopListening()

return (
<div>

<button onClick={start}>🎤 Start</button>

<button onClick={stop}>Stop</button>

<p>{transcript}</p>

</div>
)
}