import React from 'react'
import 'leaflet/dist/leaflet.css';
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { markerTypeIcons } from './markerTypeIcons';

export default function Markerdisplay (props){ 
  // Choose icon based on markerType
  let icon = undefined;
  if (props.markerType && markerTypeIcons[props.markerType]) {
      icon = new L.Icon({
          iconUrl: markerTypeIcons[props.markerType],
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
      });
  }
    return (
      <Marker
        position={props.position}
        icon={icon}
        onMouseOver={e => { e.target.openPopup(); }}
        onMouseOut={e => { e.target.closePopup(); }}
      >
        <Popup>  
       <div style={{ overflow:'auto' }}> 
          <h4><b>Name:</b> {props.name}</h4>
          {props.notes && <h4><b>Notes:</b> {props.notes}</h4>}
          {props.markerType && <h4><b>Type:</b> {props.markerType}</h4>}
          {props.photo && <div><img src={props.photo} alt="marker" style={{maxWidth:'100px',maxHeight:'100px'}} /></div>}
       </div>
        </Popup>
        </Marker>)
}
