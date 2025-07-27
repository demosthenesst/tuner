// pitch-processor.js
class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(4096);
    this.bufferOffset = 0;
    this.port.onmessage = (e) => {
      if (e.data && e.data.command === 'init') {
        this.sampleRate = e.data.sampleRate;
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const inputData = input[0];

    for (let i = 0; i < inputData.length; i++) {
      if (this.bufferOffset < this.buffer.length) {
        this.buffer[this.bufferOffset++] = inputData[i];
      }

      if (this.bufferOffset === this.buffer.length) {
        this.port.postMessage(this.buffer);
        this.bufferOffset = 0;
      }
    }

    return true;
  }
}

registerProcessor('pitch-processor', PitchProcessor);