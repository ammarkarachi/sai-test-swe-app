import './App.css';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { useEffect, useState } from 'react';

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/north-america.json";

const MapChart = (props: {point: [number, number]}) => {

  return (
    <ComposableMap  projection="geoAlbers">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#96BBBB"
              stroke="#618985"
            />
          ))
        }
      </Geographies>
      <Marker coordinates={props.point}>
        <circle r={8} fill="#F15025" />
      </Marker>
    </ComposableMap>
  );
};

// #F15025
//#896279
function DataDisplay({altitude, speed, voltage, heading }: {altitude: number, speed: number, voltage: number, heading: number}) {
 return (<div style={{
  position: 'absolute',
  bottom: '50px',
  color: '#618985',
  margin: '0 20px',
 }} >
    <h1>Telemetry</h1>
    <TelemetryItem name="Altitude" value={altitude} unit={'ft'} />
    <TelemetryItem name="Speed" value={speed} unit={'kts'} />
    <TelemetryItem name="Voltage" value={voltage} unit={'V'} />
    <TelemetryItem name="Heading" value={heading} unit={'Deg'} />
  </div>)
}

function TelemetryItem({name, value, unit}: {name: string, value: number, unit:string}) {
  return (
    <div style={{ display: 'flex', justifyContent:'space-between' }} >
      <span>{name}</span>
      <span>{value} {unit}</span>
    </div>
  )
}

function App() {
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [heading, setHeading] = useState(0);
  const [location , setLocation] = useState([0,0]);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      console.log('connected');
    };
    socket.onmessage = (e) => {
      const {
        altitude,
        speed,
        voltage,
        heading,
        point
      } = JSON.parse(e.data)
      setLocation(point);
      setAltitude(altitude);
      setSpeed(speed);
      setVoltage(voltage);
      setHeading(heading);
    };
  },[])

  return (
    <div className="App" style={{ background: '#191919' }}>
      <MapChart point={[location[0], location[1]]} />
      <DataDisplay altitude={altitude} speed={speed} voltage={voltage} heading={heading} />
    </div>
  );
}

export default App;
