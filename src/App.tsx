import React, { useEffect, useState } from "react";
import "./App.css";
// @ts-ignore
import CircularSlider from "@fseehawer/react-circular-slider";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
// import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import CheckIcon from "@material-ui/icons/Check";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

function App() {
  const [isConvolverEnabled, setConvolverEnabled] = useState(false);
  const [SLTFs, setSLTFs] = useState<AudioBuffer[]>([]);
  const [angle, setAngle] = useState(0);

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

  // @ts-ignore
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  const ctx = new AudioContext();

  // let sampleSource: AudioBufferSourceNode;
  // 再生中のときはtrue

  // 音源を取得しAudioBuffer形式に変換して返す関数
  const setupAudio = async (url: string): Promise<AudioBuffer> => {
    const response = await fetch(url);
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

  // AudioBufferをctxに接続し再生する関数
  // const playSample = (ctx: AudioContext, audioBuffer: AudioBuffer) => {
  // };
  const convolver = ctx.createConvolver();

  const onClickPlayBtn = async () => {
    const sample = await setupAudio(`${process.env.PUBLIC_URL}/w5s_2ch.wav`);

    const sampleSource = ctx.createBufferSource();
    if (sampleSource == null) {
      console.log("sampleSource is null");
      return;
    }
    sampleSource.buffer = sample;
    if (isConvolverEnabled) {
      convolver.buffer = await setupAudio(`${process.env.PUBLIC_URL}/SLTF_${angle*10}.wav`);
      console.log(convolver);
      sampleSource.connect(convolver);
      convolver.connect(ctx.destination);
    } else {
      sampleSource.connect(ctx.destination);
    }
    sampleSource.start();
  };

  useEffect(() => {
      console.log("reading");
      const arr = Array(360).fill(null);

      (async () => {
        const pSLTFs = await Promise.all(
          arr.map(async (_, i) => await setupAudio(`${process.env.PUBLIC_URL}/SLTF_${i * 10}.wav`))
        );
        setSLTFs(pSLTFs);
        console.log(SLTFs);
      })();

    }
    , []);


  const onChangeSlider = async (angle: any) => {
    // console.log(`${process.env.PUBLIC_URL}/SLTF_${angle as number * 10}.wav`);
    // convolver.buffer = await setupAudio(`${process.env.PUBLIC_URL}/SLTF_${angle as number * 10}.wav`);
    // console.log(angle);
    setAngle(angle as number % 360)
    console.log("angle: ", angle as number % 360, "has: ", SLTFs[angle as number] != null);
    convolver.buffer = SLTFs[angle as number % 360];
  };

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
          <Button color="primary" variant="contained" className="play" onClick={onClickPlayBtn}>
            play
          </Button>
          <ToggleButton
            value="check"
            color="primary"
            selected={isConvolverEnabled}
            onChange={() => {
              setConvolverEnabled(!isConvolverEnabled);
            }}
          >
            <CheckIcon/>
          </ToggleButton>
        </MuiThemeProvider>
      </header>
    </div>
  );
}

export default App;
