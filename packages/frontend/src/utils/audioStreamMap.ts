interface RealTimeAudio {
  stream: MediaStream;
  audio: HTMLAudioElement;
}

class AudioStreamManager {
  private map = new Map<string, RealTimeAudio>();

  add(id: string, stream: MediaStream) {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;

    if (stream.getAudioTracks().length === 0) {
      console.warn("stream has 0 audio tracks, so nothing will be played.");
    }

    this.map.set(id, {
      stream,
      audio,
    });

    return this;
  }

  remove(id: string) {
    const realTimeAudio = this.map.get(id);
    if (!realTimeAudio) return false;
    const { audio } = realTimeAudio;

    this.map.delete(id);

    // 가비지 콜렉션의 대상 되게 하기
    audio.pause();

    return true;
  }

  mute(id: string) {
    const realTimeAudio = this.map.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = false;

    return true;
  }

  unMute(id: string) {
    const realTimeAudio = this.map.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = true;

    return true;
  }

  toggleMute(id: string) {
    const realTimeAudio = this.map.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;

    return true;
  }

  isMute(id: string) {
    const realTimeAudio = this.map.get(id);
    if (!realTimeAudio) return false;
    const { stream } = realTimeAudio;

    return !stream.getAudioTracks()[0].enabled;
  }
}

export const audioStreamManager = new AudioStreamManager();
