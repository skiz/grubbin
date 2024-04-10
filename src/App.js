import './App.css';
import React from 'react';
import { useState } from 'react';
import { Stage, Layer, Image, Rect, Text, Line, Group } from 'react-konva';
import useImage from 'use-image';

import useSound from 'use-sound';
import clickSfx from './click.mp3';
import { Html } from 'react-konva-utils';

const canvasWidth = 1229;
const canvasHeight = 771;
const screenWidth = 795;
const screenHeight = 500;
const screenX = 105;
const screenY = 95;

// Hard Coded Data [0..4]
const staticLureData = [
  { id: 1, type: 'Jig', name: 'Whipper Snapper', minTemp: 50, maxTemp: 70, clarity: 'Clear', season: 'Fall', structure: 'Open Water', style: 'Jigging', price: '$12.99', details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nullam eget felis eget nunc lobortis mattis aliquam faucibus.' },
  { id: 2, type: 'Lure', name: 'Samson Swimmer', minTemp: 30, maxTemp: 40, clarity: 'Murky', season: 'Winter', structure: 'Shore Line', style: 'Jigging', price: '$14.29', details: ' Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Nunc sed id semper risus in. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Amet tellus cras adipiscing enim eu turpis.' },
  { id: 3, type: 'Popper', name: 'Big Popper', minTemp: 50, maxTemp: 70, clarity: 'Any', season: 'Summer', structure: 'Open Water', style: 'Trolling', price: '$9.99', details: ' Tellus integer feugiat scelerisque varius morbi enim nunc faucibus a. Diam vel quam elementum pulvinar. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. ' },
  { id: 4, type: 'Worm', name: 'Sand Bugger', minTemp: 30, maxTemp: 60, clarity: 'Any', season: 'Summer', structure: 'Reeds/Pads', style: 'Casting', price: '$12.99', details: 'Sagittis orci a scelerisque purus semper eget duis at. Ultrices tincidunt arcu non sodales neque. Amet venenatis urna cursus eget nunc scelerisque viverra mauris. Vivamus arcu felis bibendum ut tristique et. Semper viverra nam libero justo.' },
  { id: 5, type: 'Lure', name: 'Shark Bait', minTemp: 25, maxTemp: 55, clarity: 'Clear', season: 'Spring', structure: 'Open Water', style: 'Casting', price: '$14.99', details: 'Volutpat ac tincidunt vitae semper quis lectus nulla at. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Sed velit dignissim sodales ut eu sem integer vitae. Tellus at urna condimentum mattis pellentesque.' },
]

// Start with every lure loaded.
var lureData = staticLureData;

const LureImage = ({ id }) => {
  const [image] = useImage("/lures/" + id + ".png");
  return <Image className="lure" image={image} width={600} height={400} align="center" offsetX={-screenX + 20} y={140} />;
}

const LureHeader = ({ text }) => {
  return <Text y={140} fontSize={50} width={screenWidth} text={text} align="center" offsetX={-screenX / 2 + 25} fill='#aaa' />;
}

const LureEnumerator = ({ offset }) => {
  return <Text y={100} fontSize={26} width={screenWidth} text={(offset + 1) + " of " + lureData.length} align="left" offsetX={-screenX / 2 + 25} fill='#aaa' />;
}

const BgImage = () => {
  const [image] = useImage("/finder.png")
  return <Image image={image} />;
}

export default function App() {
  const [lureOffset, setLureOffset] = useState(0);
  const [currentLureData, setCurrentLureData] = useState(lureData[lureOffset]);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [clickSound] = useSound(clickSfx);
  const [power, setPower] = useState(true);
  const [muted, setMuted] = useState(false);

  // Filters
  const [seasonSpring, setSeasonSpring] = useState(true);
  const [seasonSummer, setSeasonSummer] = useState(true);
  const [seasonFall, setSeasonFall] = useState(true);
  const [seasonWinter, setSeasonWinter] = useState(true);

  // TODO: Pull data from API instead of fumbling with filtering lureData..
  React.useEffect(() => {
    filterLureData();
  }, [seasonSpring, seasonSummer, seasonFall, seasonWinter]);

  const filterLureData = () => {
    lureData = staticLureData.filter((l) => {
      return (seasonSpring && l.season === "Spring"
        || seasonSummer && l.season === "Summer"
        || seasonFall && l.season === "Fall"
        || seasonWinter && l.season === "Winter")
    });
    setLureOffset(0);
    if (lureData.length == 0) {
      setCurrentLureData(null);
      return;
    }
    setCurrentLureData(lureData[lureOffset]);
  }

  const handleButton = (e) => {
    if (power || e.target.id() === 'powerButton') {
      if (!muted) {
        clickSound();
      }
    } else if (!power) {
      return;
    }

    switch (e.target.id()) {
      case 'powerButton':
        setPower(!power);
        break;
      case 'muteButton':
        setMuted(!muted);
        break;
      case 'rightButton':
        if (lureOffset < lureData.length - 1) {
          const next = lureOffset + 1;
          setLureOffset(next);
          setCurrentLureData(lureData[next]);
        } else {
          const next = 0;
          setLureOffset(next);
          setCurrentLureData(lureData[next]);
        }
        break;
      case 'leftButton':
        if (lureOffset === 0) {
          const next = lureData.length - 1;
          setLureOffset(next);
          setCurrentLureData(lureData[next]);
        } else {
          const next = lureOffset - 1;
          setLureOffset(next);
          setCurrentLureData(lureData[next]);
        }
        break;
      case 'downButton':
        setShowDetails(true);
        break;
      case 'upButton':
        setShowDetails(false);
        break;
      case 'filterButton':
        setShowFilters(!showFilters);
        break;
      case 'checkButton':
        if (showFilters) {
          setShowFilters(false);
          break;
        }
        break;
      case 'backButton':
        if (showFilters) {
          setShowFilters(false);
          break;
        }
        if (showDetails) {
          setShowDetails(false);
          break;
        }
        break;
      case 'plusButton':
        // TODO: Zoom in lure, or add 1 to cart.
        break;
      case 'minusButton':
        // TODO: Zoom out lure, or remove 1 from cart.
        break;
      default:
        console.log("Unhandled button");
    }
  }

  // TODO: Implement button hover cursors
  const cursorEnter = (e) => { if (power) { } }
  const cursorLeave = (e) => { }

  const LureDetails = () => {
    const yOffset = 440;
    const detailText = 33;
    const lOffset = -10;
    const rOffset = 10;
    const textColor = "#aaa"

    let line = (line) => {
      return yOffset + (detailText * line) + (line * detailText / 10);
    }

    return <>
      {/* Left Side */}
      <Text y={line(0)} text={"Type: " + currentLureData.type} fontSize={detailText} align="left" offsetX={lOffset} width={screenWidth} fill={textColor} />
      <Text y={line(1)} text={"Water Clarity: " + currentLureData.clarity} offsetX={lOffset} fontSize={detailText} align="left" width={screenWidth} fill={textColor} />
      <Text y={line(2)} text={"Structure: " + currentLureData.structure} offsetX={lOffset} fontSize={detailText} align="left" width={screenWidth} fill={textColor} />
      <Text y={line(3)} text={"Water Temp: " + currentLureData.minTemp + "° to " + currentLureData.maxTemp + "°f"} offsetX={lOffset} fontSize={detailText} align="left" width={screenWidth} fill={textColor} />

      {/* Right Side */}
      <Text y={line(0)} text={"Season: " + currentLureData.season} fontSize={detailText} align="right" offsetX={rOffset} width={screenWidth} fill={textColor} />
      <Text y={line(1)} text={"Style: " + currentLureData.style} fontSize={detailText} align="right" offsetX={rOffset} width={screenWidth} fill={textColor} />
      <Text y={line(3)} text={"Price: " + currentLureData.price} fontSize={detailText} align="right" offsetX={rOffset} width={screenWidth} fill={textColor} />
    </>
  }

  class FinderScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }


    render() {
      if (this.state.hasError || currentLureData == null) {
        return <Layer id="screen" offsetX={-screenX} >
          <LureEnumerator offset={lureOffset} />
        </Layer>
      }
      return <Layer id="screen" offsetX={-screenX} >
        <LureImage id={currentLureData.id} />
        <LureEnumerator offset={lureOffset} />
        <LureHeader text={currentLureData.name} />
        <LureDetails />
      </Layer>
    }
  }

  class FinderDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }


    render() {
      if (this.state.hasError || currentLureData == null) {
        return <Layer id="details" >
        </Layer>
      }
      return <Layer id="details">
        <Rect x={screenX} y={screenY} width={screenWidth} height={screenHeight} fill="black" shadowBlur={80} cornerRadius={10} opacity={!showDetails ? 0 : 100} />
        <Text x={screenX} y={screenY} width={screenWidth} fontSize="30" text={currentLureData.name} align="left" fill='white' opacity={!showDetails ? 0 : 100} />
        <Text x={screenX} y={screenY + 50} width={screenWidth} fontSize="30" text={currentLureData.details} align="left" fill='white' opacity={!showDetails ? 0 : 100} />
      </Layer>
    }
  }

  // TODO: Convert children FinderButton and FinderLight Components
  class FinderButtons extends React.Component {
    render() {
      return <Layer id="buttons" offsetX={-900} offsetY={-100}>
        <Line id="rightButton" x={145} y={255} points={[0, 0, 50, 50, 50, -50, 0, 0]} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Line id="leftButton" x={145} y={255} points={[0, 0, 50, 50, 50, -50, 0, 0]} rotation={180} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Line id="downButton" x={145} y={255} points={[0, 0, 50, 50, 50, -50, 0, 0]} rotation={90} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Line id="upButton" x={145} y={255} points={[0, 0, 50, 50, 50, -50, 0, 0]} rotation={270} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="checkButton" x={230} y={200} width={30} height={115} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="powerButton" x={210} y={410} width={55} height={28} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="muteButton" x={135} y={410} width={65} height={28} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="backButton" x={130} y={125} width={140} height={28} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="filterButton" x={130} y={355} width={145} height={35} closed stroke="white" opacity={0} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="muteLight" x={155} y={460} width={20} height={10} closed stroke="white" fill={power && muted ? "red" : "gray"} opacity={100} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
        <Rect id="powerLight" x={225} y={460} width={20} height={10} closed stroke="white" fill={power ? "green" : "gray"} opacity={100} onClick={handleButton} onMouseEnter={cursorEnter} onMouseLeave={cursorLeave} />
      </Layer>
    }
  }

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer id="bg">
        <BgImage />
        <Rect x={screenX} y={screenY} width={screenWidth} height={screenHeight} fill="black" shadowBlur={80} cornerRadius={10} />
      </Layer>
      <FinderScreen />
      <FinderButtons />
      <FinderDetails />
      <Layer id="filter">
        <Group >
          <Rect x={screenX} y={screenY} width={screenWidth} height={screenHeight} fill="black" shadowBlur={80} cornerRadius={10} opacity={!showFilters ? 0 : 100} />
          <Html>
            <div style={{ color: "#eee", fontSize: '24px', lineHeight: '30px', fontWeight: 'bold', marginLeft: 120, marginTop: 100, display: showFilters && power ? 'block' : 'none' }}>
              <h2 style={{ marginBottom: 40 }}>Lure Filters</h2>
              <h3>Season</h3>
              <div>
                <input type="checkbox" id="seasonSpring" style={{ width: '28px', height: '28px' }} hidden={showFilters ? 0 : 100} checked={seasonSpring} onChange={() => setSeasonSpring(!seasonSpring)} /><label for="seasonSpring" style={{ margin: '15px' }}>Spring</label>
                <input type="checkbox" id="seasonSummer" style={{ width: '28px', height: '28px' }} hidden={showFilters ? 0 : 100} checked={seasonSummer} onChange={() => setSeasonSummer(!seasonSummer)} /><label for="seasonSummer" style={{ margin: '15px' }}>Summer</label>
                <input type="checkbox" id="seasonFall" style={{ width: '28px', height: '28px' }} hidden={showFilters ? 0 : 100} checked={seasonFall} onChange={() => setSeasonFall(!seasonFall)} /><label for="seasonFall" style={{ margin: '15px' }}>Fall</label>
                <input type="checkbox" id="seasonWinter" style={{ width: '28px', height: '28px' }} hidden={showFilters ? 0 : 100} checked={seasonWinter} onChange={() => setSeasonWinter(!seasonWinter)} /><label for="seasonWinter" style={{ margin: '15px' }}>Winter</label>
              </div>
            </div>
          </Html>
        </Group>
      </Layer>
      <Layer id="power">
        <Rect x={screenX} y={screenY} width={screenWidth} height={screenHeight} fill="black" shadowBlur={80} cornerRadius={10} opacity={power ? 0 : 100} />
      </Layer>
    </Stage >
  );
}

