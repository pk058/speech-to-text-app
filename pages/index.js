import { useState, useEffect } from 'react'

export default function Home() {
	const [isListening, setIsListening] = useState(false)
	const [speechToText, setSpeechToText] = useState('')
	const [recognition, setRecognition] = useState(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const recognitionInstance = window.SpeechRecognition || window.webkitSpeechRecognition

			if (!recognitionInstance) {
				alert('Speech Recognition is not supported by your browser. Try using Chrome or Edge.')
			} else {
				const recognition = new recognitionInstance()
				setRecognition(recognition)
			}
		}
	}, [])

	const startListening = () => {
		if (recognition) {
			recognition.continuous = true
			recognition.interimResults = true
			recognition.lang = 'en-US'

			recognition.onresult = (event) => {
				const transcript = Array.from(event.results)
					.map((result) => result[0])
					.map((result) => result.transcript)
					.join('')

				setSpeechToText(transcript)
			}

			recognition.start()
			setIsListening(true)

			recognition.onerror = (event) => {
				console.error('Error occurred in recognition:', event.error)
			}

			recognition.onend = () => {
				setIsListening(false)
			}
		}
	}

	const stopListening = () => {
		if (recognition) {
			recognition.stop()
			setIsListening(false)
		}
	}

	return (
		<div>
			<h1>Speech to Text</h1>
			<p>{speechToText}</p>
			<button onClick={startListening} disabled={isListening}>
				Start Listening
			</button>
			<button onClick={stopListening} disabled={!isListening}>
				Stop Listening
			</button>
		</div>
	)
}
