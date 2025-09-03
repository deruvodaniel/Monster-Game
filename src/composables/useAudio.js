import { ref } from 'vue'

export function useAudio() {
  const soundEnabled = ref(true)
  const audioCtx = ref(null)
  
  // Background music tracks
  const bgmTracks = {
    landing: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F84bd54c61bf14dafa0e86116011e9010?alt=media&token=00db2d6f-6946-4a95-8869-24f51b640905&apiKey=eb9edba76d874a5385833a00b6be2b6e',
    battle: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F9386db22b85a440b98e94a68f979d6b8?alt=media&token=36bbf65f-430f-4709-855e-80f83760a23f&apiKey=eb9edba76d874a5385833a00b6be2b6e',
    credits: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F14003e39846b4575a9549f77f31cb8c0?alt=media&token=009b1637-30da-470d-bfd9-2a123e8137a7&apiKey=eb9edba76d874a5385833a00b6be2b6e',
    congrats: 'https://cdn.builder.io/o/assets%2Feb9edba76d874a5385833a00b6be2b6e%2F14003e39846b4575a9549f77f31cb8c0?alt=media&token=009b1637-30da-470d-bfd9-2a123e8137a7&apiKey=eb9edba76d874a5385833a00b6be2b6e'
  }
  
  const bgmAudioA = ref(null)
  const bgmAudioB = ref(null)
  const bgmActive = ref('A')
  const bgmVolume = ref(0.6)
  const bgmFadeTimer = ref(null)
  const bgmCurrentUrl = ref(null)
  const bgmTargetUrl = ref(null)
  const bgmStage = ref(null)

  const initAudio = () => {
    if (!audioCtx.value) {
      const AC = window.AudioContext || window.webkitAudioContext
      try {
        audioCtx.value = new AC()
      } catch (e) {
        audioCtx.value = null
      }
    }
  }

  const sound = (name) => {
    if (!soundEnabled.value) return
    
    initAudio()
    const ctx = audioCtx.value
    if (!ctx) return
    
    try {
      if (ctx.state === 'suspended') ctx.resume()
    } catch (e) {}
    
    const now = ctx.currentTime
    
    const play = (freq, type = 'sine', dur = 0.14, vol = 0.1, delay = 0) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.setValueAtTime(freq, now + delay)
      g.gain.setValueAtTime(0, now + delay)
      g.gain.linearRampToValueAtTime(vol, now + delay + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)
      o.connect(g)
      g.connect(ctx.destination)
      o.start(now + delay)
      o.stop(now + delay + dur + 0.05)
    }
    
    const sweep = (startF, endF, dur = 0.25, type = 'square', vol = 0.14, delay = 0) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.setValueAtTime(startF, now + delay)
      o.frequency.exponentialRampToValueAtTime(Math.max(endF, 1), now + delay + dur)
      g.gain.setValueAtTime(0, now + delay)
      g.gain.linearRampToValueAtTime(vol, now + delay + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)
      o.connect(g)
      g.connect(ctx.destination)
      o.start(now + delay)
      o.stop(now + delay + dur + 0.05)
    }
    
    const noiseBurst = (dur = 0.1, vol = 0.12, delay = 0) => {
      const frames = Math.max(1, Math.floor(ctx.sampleRate * dur))
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      const g = ctx.createGain()
      src.buffer = buffer
      g.gain.setValueAtTime(0, now + delay)
      g.gain.linearRampToValueAtTime(vol, now + delay + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)
      src.connect(g)
      g.connect(ctx.destination)
      src.start(now + delay)
    }
    
    switch (name) {
      case 'attack':
        sweep(600, 180, 0.12, 'sawtooth', 0.24)
        play(120, 'square', 0.08, 0.24, 0.12)
        noiseBurst(0.07, 0.28, 0.12)
        break
      case 'hit':
        play(120, 'sine', 0.08, 0.2)
        play(90, 'triangle', 0.09, 0.16, 0.04)
        noiseBurst(0.06, 0.2, 0.02)
        break
      case 'special':
        sweep(220, 1200, 0.32, 'square', 0.35)
        play(1567.98, 'sine', 0.12, 0.22, 0.32)
        play(1318.51, 'sine', 0.12, 0.20, 0.38)
        noiseBurst(0.18, 0.40, 0.34)
        play(196, 'square', 0.18, 0.30, 0.36)
        break
      case 'heal':
        play(392.0, 'sine', 0.12, 0.12)
        play(523.25, 'sine', 0.12, 0.12, 0.08)
        play(659.25, 'sine', 0.16, 0.12, 0.16)
        break
      case 'defend':
        play(329.63, 'triangle', 0.12, 0.12)
        play(415.30, 'triangle', 0.12, 0.12, 0.06)
        break
      case 'win':
        play(523.25, 'sine', 0.15, 0.07)
        play(659.25, 'sine', 0.15, 0.07, 0.05)
        play(783.99, 'sine', 0.2, 0.07, 0.1)
        break
      case 'lose':
        play(392, 'sawtooth', 0.18, 0.06)
        play(261.63, 'sawtooth', 0.22, 0.06, 0.08)
        break
      case 'start':
        play(329.63, 'sine', 0.12, 0.06)
        play(392, 'sine', 0.12, 0.06, 0.08)
        break
    }
  }

  const playBgmForStage = (stage) => {
    const url = bgmTracks[stage]
    if (!url || !soundEnabled.value) {
      stopBgm()
      return
    }
    
    const ensure = (which) => {
      if (which === 'A' && !bgmAudioA.value) {
        bgmAudioA.value = new Audio()
        bgmAudioA.value.loop = true
        bgmAudioA.value.volume = 0
      }
      if (which === 'B' && !bgmAudioB.value) {
        bgmAudioB.value = new Audio()
        bgmAudioB.value.loop = true
        bgmAudioB.value.volume = 0
      }
    }
    
    ensure('A')
    ensure('B')
    
    if ((bgmStage.value === stage && bgmCurrentUrl.value === url) || bgmTargetUrl.value === url) {
      const a = bgmAudioA.value
      const b = bgmAudioB.value
      if ((a && a.src === url && !a.paused) || (b && b.src === url && !b.paused)) return
    }
    
    const from = bgmActive.value === 'A' ? bgmAudioA.value : bgmAudioB.value
    const to = bgmActive.value === 'A' ? bgmAudioB.value : bgmAudioA.value
    
    if (to.src !== url) {
      try { to.pause() } catch(e) {}
      to.src = url
    }
    
    to.currentTime = 0
    to.volume = 0
    bgmTargetUrl.value = url
    to.play().catch(() => {})
    
    const duration = 600
    const start = performance.now()
    
    if (bgmFadeTimer.value) cancelAnimationFrame(bgmFadeTimer.value)
    
    const clampVol = (v) => Math.max(0, Math.min(1, v))
    
    const step = (ts) => {
      const t = Math.min(1, Math.max(0, (ts - start) / duration))
      to.volume = clampVol(bgmVolume.value * t)
      if (from) from.volume = clampVol(bgmVolume.value * (1 - t))
      
      if (t < 1) {
        bgmFadeTimer.value = requestAnimationFrame(step)
      } else {
        if (from) {
          try { from.pause() } catch(e) {}
          from.src = ''
          from.currentTime = 0
          from.volume = 0
        }
        bgmActive.value = bgmActive.value === 'A' ? 'B' : 'A'
        bgmCurrentUrl.value = url
        bgmStage.value = stage
        bgmTargetUrl.value = null
      }
    }
    
    bgmFadeTimer.value = requestAnimationFrame(step)
  }

  const stopBgm = () => {
    if (bgmFadeTimer.value) {
      cancelAnimationFrame(bgmFadeTimer.value)
      bgmFadeTimer.value = null
    }
    
    if (bgmAudioA.value) {
      try { bgmAudioA.value.pause() } catch(e) {}
      bgmAudioA.value.src = ''
      bgmAudioA.value.currentTime = 0
      bgmAudioA.value.volume = 0
    }
    
    if (bgmAudioB.value) {
      try { bgmAudioB.value.pause() } catch(e) {}
      bgmAudioB.value.src = ''
      bgmAudioB.value.currentTime = 0
      bgmAudioB.value.volume = 0
    }
    
    bgmCurrentUrl.value = null
    bgmTargetUrl.value = null
    bgmStage.value = null
  }

  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
    if (!soundEnabled.value) {
      stopBgm()
    }
  }

  return {
    soundEnabled,
    sound,
    playBgmForStage,
    stopBgm,
    toggleSound
  }
}