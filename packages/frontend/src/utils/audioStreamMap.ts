interface RealTimeAudio {
  stream: MediaStream;
  audio: HTMLAudioElement;
  audioContext: AudioContext;
  audioSource: MediaStreamAudioSourceNode;
  analyser: AnalyserNode;
  audioDetected: boolean;
}

export type AudioDetectListener = (
  id: string,
  isAudioDetected: boolean
) => void;

const MIN_DECIBEL = -100;
const MAX_DECIBEL = 0;
const MINIMUM_AUDIO_DETECTION_PERCENTAGE = 3;
const AUDIO_DETECTION_INTERVAL = 150;

class AudioStreamManager {
  private realTimeAudioMap = new Map<string, RealTimeAudio>();
  private audioDetectionListenerMap = new Map<string, AudioDetectListener>();
  private audioDetectionTimerId: NodeJS.Timer | number = 0;

  addStream(id: string, stream: MediaStream) {
    if (stream.getAudioTracks().length === 0) {
      console.warn("stream has 0 audio tracks, so nothing will be played.");
    }

    this.realTimeAudioMap.set(id, this.streamToRealTimeAudio(stream));

    return this;
  }

  private streamToRealTimeAudio(stream: MediaStream): RealTimeAudio {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.minDecibels = MIN_DECIBEL;
    analyser.maxDecibels = MAX_DECIBEL;
    analyser.smoothingTimeConstant = 0.3;
    audioSource.connect(analyser);

    return {
      stream,
      audio,
      audioContext,
      audioSource,
      analyser,
      audioDetected: false,
    };
  }

  removeStream(id: string) {
    const realTimeAudio = this.realTimeAudioMap.get(id);
    if (!realTimeAudio) return false;
    const { audio } = realTimeAudio;

    this.realTimeAudioMap.delete(id);
    this.audioDetectionListenerMap.delete(id);

    // 가비지 콜렉션의 대상 되게 하기
    audio.pause();

    return true;
  }

  mute(id: string) {
    const realTimeAudio = this.realTimeAudioMap.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = false;

    return true;
  }

  unMute(id: string) {
    const realTimeAudio = this.realTimeAudioMap.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = true;

    return true;
  }

  toggleMute(id: string) {
    const realTimeAudio = this.realTimeAudioMap.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;

    return true;
  }

  getMute(id: string) {
    const realTimeAudio = this.realTimeAudioMap.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    return !stream.getAudioTracks()[0].enabled;
  }

  addAudioDetectListener(id: string, listener: AudioDetectListener) {
    if (this.audioDetectionListenerMap.size === 0)
      this.startListeningAudioDetection();
    this.audioDetectionListenerMap.set(id, listener);
  }

  removeAudioDetectListener(id: string) {
    this.audioDetectionListenerMap.delete(id);
    if (this.audioDetectionListenerMap.size === 0)
      this.stopListeningAudioDetection();
  }

  private startListeningAudioDetection() {
    this.audioDetectionTimerId = setInterval(() => {
      this.detectAudioAndRunListeners();
    }, AUDIO_DETECTION_INTERVAL);
  }

  private detectAudioAndRunListeners() {
    for (const id of this.audioDetectionListenerMap.keys()) {
      const realTimeAudio = this.realTimeAudioMap.get(id);
      const listener = this.audioDetectionListenerMap.get(id);
      if (!realTimeAudio || !listener) continue;

      const audioDetected = this.isAudioDetected(realTimeAudio.analyser);

      // if audio detected state is not changed, do not run listener
      if (audioDetected === realTimeAudio.audioDetected) continue;

      realTimeAudio.audioDetected = audioDetected;
      listener(id, audioDetected);
    }
  }

  private isAudioDetected(analyser: AnalyserNode) {
    // get volume data
    const volumes = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(volumes);

    // calculate percentage
    const volume =
      volumes.reduce((prev, cur) => prev + cur, 0) / volumes.length;
    const volumePercentage =
      (volume * 100) / Math.abs(MAX_DECIBEL - MIN_DECIBEL);
    return volumePercentage >= MINIMUM_AUDIO_DETECTION_PERCENTAGE;
  }

  private stopListeningAudioDetection() {
    clearTimeout(this.audioDetectionTimerId);
    this.audioDetectionTimerId = 0;
  }
}

export const audioStreamManager = new AudioStreamManager();
