export const audioChunks: BlobPart[] = []
let mediaRecorder: MediaRecorder

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.start()

  mediaRecorder.addEventListener('dataavailable', (event) => {
    audioChunks.push(event.data)
  })
}

export function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop()
}

export const getAudioBlob: () => Promise<Blob> = async() => {
  return new Promise((resolve, reject) => {
    mediaRecorder.addEventListener('stop', () => {
      resolve(new Blob(audioChunks, { type: 'audio/webm' }))
    })
    mediaRecorder.addEventListener('error', (error) => {
      reject(error)
    })
  })
}
