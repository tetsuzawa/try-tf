import React, {useState} from "react";
import "./App.css";
// @ts-ignore
import CircularSlider from "@fseehawer/react-circular-slider";

import Button from '@material-ui/core/Button';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./theme";

function App() {

  // const [audioSrc, setAudioSrc] = useState("");

  const onChangeAudioSrc = () => {
    // setAudioSrc("");
    console.log("aaa")
    const obj = document.getElementsByTagName("input")[0].files || "";
    // const audio = document.getElementById("audio-src") as HTMLAudioElement;
    const audio = document.getElementById("audio-src");
    audio.srcObject = obj;
    console.log(obj)
    console.log(audio)
  };
  console.log("aaa")

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
          <label htmlFor="base-audio">
            <input
              type="file"
              style={{display: 'none'}}
              id="base-audio"
              name="base-audio"
              accept="audio/mpeg,audio/wav,audio/aiff"
              onChange={onChangeAudioSrc}
            />
            <Button color="primary" variant="contained" component="span">
              <AudiotrackIcon/>
              Upload audio
            </Button>
          </label>
          <audio controls id="audio-src" onChange={onChangeAudioSrc}/>
        </MuiThemeProvider>
      </header>
    </div>
  );
}

export default App;
