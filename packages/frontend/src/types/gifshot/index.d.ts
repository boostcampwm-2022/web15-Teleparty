interface CreateGIFOptions {
  images: string[];
  gifWidth?: number;
  gifHeight?: number;
  filter?: string;
  interval?: number;
  numFrames?: number;
  frameDuration?: number;
  text?: string;
  fontWeight?: string;
  fontSize?: string;
  minFontSize?: string;
  resizeFont?: boolean;
  fontFamily?: string;
  fontColor?: string;
  textAlign?: string;
  textBaseline?: string;
  sampleInterval?: number;
  numWorkers?: number;
  saveRenderingContexts?: boolean;
  savedRenderingContexts?: ImageData[];
  showFrameText?: boolean;
  textXCoordinate?: number;
  textYCoordinate?: number;
}

interface CallbackObject {
  image: string;
  error: boolean;
  errorCode: string;
  errorMsg: string;
  savedRenderingContexts: ImageData[];
}

type CreateGIFCallback = (obj: CallbackObject) => void;

declare namespace gifshot {
  function createGIF(callback: CreateGIFCallback): void;
  function createGIF(
    options: CreateGIFOptions,
    callback: CreateGIFCallback
  ): void;
}
export = gifshot;
