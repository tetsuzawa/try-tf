import React, { useEffect, useState } from "react";
import "./App.css";
// @ts-ignore
import CircularSlider from "@fseehawer/react-circular-slider";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import firebase from "./firebase";

function App() {
  const [isPlaying, setPlaying] = useState(false);
  const [isConvolverEnabled, setConvolverEnabled] = useState(false);
  const [SLTFs, setSLTFs] = useState<AudioBuffer[]>([]);
  const [baseAudio, setBaseAudio] = useState<AudioBuffer | null>(null);
  const [angle, setAngle] = useState(0);
  // @ts-ignore
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (window.AudioContext === null || window.AudioContext === undefined) {
    console.log("bad browser");
  }
  const [ctx] = useState(new AudioContext({ sampleRate: 48000 }));
  // const [sampleSource, setSampleSource] = useState<AudioBufferSourceNode | null>(null);
  // const [convolver, setConvolver] = useState<AudioBufferSourceNode | null>(null);
  const [sampleSource, setSampleSource] = useState<AudioBufferSourceNode>(ctx.createBufferSource());
  const [convolver, setConvolver] = useState<ConvolverNode>(ctx.createConvolver());

  // const onChangeAudioSrc = () => {
  //   // setAudioSrc("");
  //   console.log("aaa");
  //   const obj = document.getElementsByTagName("input")[0].files || "";
  //   // const audio = document.getElementById("audio-src") as HTMLAudioElement;
  //   const audio = document.getElementById("audio-src");
  //   if (audio !== null){
  //     audio.srcObject = obj;
  //   }
  //   console.log(obj);
  //   console.log(audio);
  // };

  // const ctx = new AudioContext();

  // let sampleSource: AudioBufferSourceNode;
  // 再生中のときはtrue

  // AudioBufferをctxに接続し再生する関数
  // const playSample = (ctx: AudioContext, audioBuffer: AudioBuffer) => {
  // };
  // let sampleSource = ctx.createBufferSource();
  // let convolver = ctx.createConvolver();

  const onClickPlayBtn = () => {
    if (isPlaying) {
      console.log("now playing");
      return;
    }
    // sampleSource = ctx.createBufferSource();
    setSampleSource(ctx.createBufferSource());
    sampleSource.buffer = baseAudio;

    if (isConvolverEnabled) {
      // convolver.buffer = await setupAudio(`${process.env.PUBLIC_URL}/SLTF_${angle * 10}.wav`);
      // const convolver = ctx.createConvolver();
      // convolver = ctx.createConvolver();
      setConvolver(ctx.createConvolver());
      convolver.buffer = SLTFs[angle];
      console.log(angle);
      console.log("sampleSource: ", sampleSource);
      console.log("convolver: ", convolver);
      sampleSource.connect(convolver);
      convolver.connect(ctx.destination);
    } else {
      sampleSource.connect(ctx.destination);
    }
    setPlaying(true);
    sampleSource.onended = () => {
      console.log("ended");
      setPlaying(false);
    };
    sampleSource.start();
  };

  // const onClickStopBtn = () => {
  //   if (!isPlaying) {
  //     console.log("can not stop");
  //     return;
  //   }
  //   // sampleSource.stop();
  //   setPlaying(false);
  // };

  useEffect(() => {
    // 音源を取得しAudioBuffer形式に変換して返す関数
    const setupAudio = async (url: string): Promise<AudioBuffer> => {
      const response = await fetch(url, {
        mode: "cors",
      });
      const arrayBuffer = await response.arrayBuffer();
      // Web Audio APIで使える形式に変換
      const dec = await ctx.decodeAudioData(arrayBuffer);
      console.log("reading audio url: ", url);
      console.log("num of channels: ", dec.numberOfChannels);
      console.log("num of sample rate: ", dec.sampleRate);
      console.log("length: ", dec.length);
      console.log("duration: ", dec.duration);
      return dec;
    };

    console.log("reading");
    const arr = Array(360).fill(null);

    (async () => {
      const pSLTFs = await Promise.all(
        arr.map(
          async (_, i) =>
            await (async (): Promise<AudioBuffer> => {
              const audioRef = firebase.storage.ref(
                `public/subjects/TETSU/SLTF/SLTF_${i * 10}.wav`
              );
              console.log(audioRef);
              const audioURL = await audioRef.getDownloadURL();
              console.log(audioURL);
              return setupAudio(audioURL);
              // return setupAudio(`${process.env.PUBLIC_URL}/SLTF_${i * 10}.wav`);
            })()
        )
      );
      setSLTFs(pSLTFs);
      const audioRef = firebase.storage.ref("public/common/w5s_2ch.wav");
      console.log(audioRef);
      const audioURL = await audioRef.getDownloadURL();
      console.log(audioURL);
      const audio = await setupAudio(audioURL);
      // const audio = await setupAudio(`${process.env.PUBLIC_URL}/w5s_2ch.wav`);
      setBaseAudio(audio);
    })();
  }, [ctx]);

  const onChangeSlider = (angle: any) => {
    // console.log(`${process.env.PUBLIC_URL}/SLTF_${angle as number * 10}.wav`);
    // convolver.buffer = await setupAudio(`${process.env.PUBLIC_URL}/SLTF_${angle as number * 10}.wav`);
    // console.log(angle);
    setAngle((angle as number) % 360);
    console.log("angle: ", (angle as number) % 360, "has: ", SLTFs[angle as number] != null);
    // if (convolver === undefined) {
    //   return;
    // }
    // setTimeout(() => {
    // sampleSource.disconnect();
    // sampleSource = ctx.createBufferSource();
    // sampleSource.buffer = baseAudio;
    // convolver.disconnect();
    // convolver = ctx.createConvolver();
    // kokokara
    // convolver.buffer = SLTFs[angle as number % 360];
    // convolver.normalize = true;
    // sampleSource.connect(convolver);
    // convolver.connect(ctx.destination);
    setConvolver((prev) => {
      prev.buffer = SLTFs[(angle as number) % 360];
      prev.connect(ctx.destination);
      return prev;
    });
    setSampleSource((prev) => {
      prev.connect(convolver);
      return prev;
    });

    // sampleSource.start()
    // });
  };

  // const onClickSwitchAngleBtn = () => {
  //   if (sampleSource === undefined) {
  //     console.log("sampleSource is undefined");
  //     sampleSource = ctx.createBufferSource();
  //     return;
  //   }
  //   if (convolver === undefined) {
  //     console.log("convolver is undefined");
  //     convolver = ctx.createConvolver();
  //     return;
  //   }
  //   // sampleSource.disconnect();
  //   sampleSource = ctx.createBufferSource();
  //   sampleSource.buffer = baseAudio;
  //   // convolver.disconnect();
  //   convolver = ctx.createConvolver();
  //   convolver.buffer = SLTFs[angle as number % 360];
  //   convolver.normalize = true;
  //   sampleSource.connect(convolver);
  //   convolver.connect(ctx.destination);
  // };

  return (
    <div className="App">
      <header className="App-header">
        <MuiThemeProvider theme={theme}>
          <CircularSlider
            min={0}
            max={360}
            direction={1}
            knobPosition="top"
            appendToValue="°"
            valueFontSize="4rem"
            labelColor="#61DAFB"
            knobColor="#61DAFB"
            progressColorFrom="#FFFFFF"
            progressColorTo="#FFFFFF"
            trackColor="#FFFFFF"
            onChange={onChangeSlider}
          />
          {/*<label htmlFor="base-audio">*/}
          {/*  <input*/}
          {/*    type="file"*/}
          {/*    style={{ display: "none" }}*/}
          {/*    id="base-audio"*/}
          {/*    name="base-audio"*/}
          {/*    accept="audio/mpeg,audio/wav,audio/aiff"*/}
          {/*    onChange={onChangeAudioSrc}*/}
          {/*  />*/}
          {/*  <Button color="primary" variant="contained" component="span">*/}
          {/*    <AudiotrackIcon />*/}
          {/*    Upload audio*/}
          {/*  </Button>*/}
          {/*</label>*/}
          {/*<audio controls id="audio-src" onChange={onChangeAudioSrc} />*/}
          <FormControlLabel
            control={
              <Switch
                color="primary"
                onChange={() => {
                  setConvolverEnabled(!isConvolverEnabled);
                }}
              />
            }
            label="Attach HRTF"
          />
          <Button
            color="primary"
            variant="contained"
            className="play"
            disabled={isPlaying}
            onClick={onClickPlayBtn}
          >
            play
          </Button>
          {/*<Button color="primary" variant="contained" className="stop" onClick={onClickStopBtn}>*/}
          {/*  stop*/}
          {/*</Button>*/}
          {/*<Button color="primary" variant="contained" className="switch-angle" onClick={onClickSwitchAngleBtn}>*/}
          {/*  switch angle*/}
          {/*</Button>*/}
        </MuiThemeProvider>
      </header>
    </div>
  );
}

export default App;
