<template>
  <div class="camera">
    <video muted autoplay ref="videoRef" id="video">
      Video stream not available.
    </video>
    <button id="startbutton" @click="takePicture">Take photo</button>
  </div>
  <canvas ref="canvasRef" id="canvas" hidden> </canvas>
  <div class="output">
    <img
      ref="photoRef"
      id="photo"
      alt="The screen capture will appear in this box."
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

let width = 300
let height = 0
let streaming = false
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const photoRef = ref<HTMLImageElement | null>(null)

onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: 'environment',
      },
      audio: false,
    })
    .then((stream) => {
      if (!videoRef.value) return
      videoRef.value.srcObject = stream
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`)
    })

  videoRef.value?.addEventListener(
    'canplay',
    () => {
      if (!streaming && videoRef.value) {
        streaming = true
        height =
          (videoRef.value.videoHeight / videoRef.value.videoWidth) * width

        videoRef.value.setAttribute('width', width.toString())
        videoRef.value.setAttribute('height', height.toString())
        if (canvasRef.value) {
          canvasRef.value.setAttribute('width', width.toString())
          canvasRef.value.setAttribute('height', height.toString())
        }
      }
    },
    false
  )

  clearPhoto()
})

const clearPhoto = () => {
  if (!canvasRef.value) return
  const context = canvasRef.value.getContext('2d')
  if (!context) return
  context.fillStyle = '#AAA'
  context.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  const data = canvasRef.value.toDataURL('image/png')
  photoRef.value?.setAttribute('src', data)
}

const takePicture = () => {
  if (!canvasRef.value) {
    console.error('No canvasRef')
    return
  }
  const context = canvasRef.value.getContext('2d')
  if (!context) {
    console.error('No context')
    return
  }

  canvasRef.value.width = width
  canvasRef.value.height = height
  if (videoRef.value) {
    context.drawImage(videoRef.value, 0, 0, width, height)
  }

  const data = canvasRef.value.toDataURL('image/png')
  photoRef.value?.setAttribute('src', data)
}
</script>
