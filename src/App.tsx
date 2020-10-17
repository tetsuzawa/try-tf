import React, { useState } from "react";
import "./App.css";
// @ts-ignore
import CircularSlider from "@fseehawer/react-circular-slider";
// import Button from "@material-ui/core/Button";
// import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

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
  const setupAudio = async (url: string) => {
    const response = await fetch(url);
    console.log("w5s: ", response);
    const arrayBuffer = await response.arrayBuffer();
    // Web Audio APIで使える形式に変換
    return await ctx.decodeAudioData(arrayBuffer);
  };

  // AudioBufferをctxに接続し再生する関数
  const playSample = (ctx: AudioContext, audioBuffer: AudioBuffer) => {
    const sampleSource = ctx.createBufferSource();
    if (sampleSource == null) {
      console.log("sampleSource is null");
      return;
    }
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(ctx.destination);
    sampleSource.start();
    setIsPlaying(true);
  };

  const onClickPlayBtn = async () => {
    if (isPlaying) return;
    const sample = await setupAudio(`${process.env.PUBLIC_URL}/w5s.wav`);
    playSample(ctx, sample);
  };

  // const onClickStopBtn = async () => {
  //   // sampleSource?.stop();
  //   // if (sampleSource == null) {
  //   //   console.log("sampleSource is null")
  //   //   return
  //   // }
  //   sampleSource.stop();
  //   setIsPlaying(false);
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
            onChange={(value: any) => console.log(value)}
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
          <button className="play" onClick={onClickPlayBtn}>
            play
          </button>
          {/*<button className="stop" onClick={onClickStopBtn}>*/}
          {/*  stop*/}
          {/*</button>*/}
        </MuiThemeProvider>
      </header>
    </div>
  );
}

export default App;
