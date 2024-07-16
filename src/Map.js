import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, ScaleControl, LayersControl, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import knustGeoJson from './buildingstogeojson'// Ensure you have this file in the src directory
import boundaryGeoJson from './boundary.json'// Ensure you have this file in the src directory
import SearchControl from './SearchControl';
import './Popup.css';


const { BaseLayer, Overlay } = LayersControl;


const geoJsonStyle = {
    color: "red",
    weight: 2,
    opacity: 5,
    fillOpacity: 0.7,
    fillColor: "pink"
}

const boundaryStyle = {
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
}

const customIcon = new L.Icon({
    iconUrl: 'https://media.istockphoto.com/id/1182235539/photo/red-map-pointer-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=a5SpK4y2N7LSrNv1RckRKFpcBROSgFqG72oLzCW4WKE=', // Example icon URL
    iconSize: [25, 25],
});



const customIcons = new L.Icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUshWl0rsERS58fFYtWeN8cDZ8m66Em99F2nNLdMiYD-68KfqNLy-bDTfImFFyUy70tV4&usqp=CAU', // Example icon URL
    iconSize: [25, 25],
});




const KNUSTMap = () => {
    const [searchResult, setSearchResult] = useState(null);

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(`<b>${feature.properties.name}</b>`);
          layer.on({
            click: (e) => {
              const popup = e.target.getPopup();
              popup.setLatLng(e.latlng).setContent(`<b>${feature.properties.name}</b>`).openOn(e.target._map);
            }
          });
        }
    };

return (
    <MapContainer center={[6.6742, -1.5714]} zoom={15} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
    
    <SearchControl setSearchResult={setSearchResult}/>
    <LayersControl position='topright' >
        <BaseLayer checked name='OpenStreetMap' />
        <BaseLayer name='OpenStreetMap'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'        
            />
        </BaseLayer>
        <Overlay name='OpenTopoMap'>
            <TileLayer

                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.opentopomap.org/copyright">OpenStreetMap</a> contributors'
            /> 
        </Overlay>
        <Overlay name='Esri Satellite'>
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
            />

        </Overlay>
    
    </LayersControl>
      <GeoJSON data={knustGeoJson}  style={geoJsonStyle} onEachFeature= {onEachFeature} />
      {searchResult && (
        <Marker position={[searchResult.lat, searchResult.lng]} icon={customIcon}>
        <Popup>
          <b>{searchResult.name}</b>
        </Popup>
      </Marker>
      )}
      <GeoJSON data={boundaryGeoJson} style={boundaryStyle} />
      <Marker position={[6.6742, -1.5714]} icon={customIcon} >
        <Popup>
          <b> Main Campus </b>
        </Popup>
      </Marker>
      <ZoomControl position='topright' />
      <ScaleControl position='bottomleft' />
    </MapContainer>
  );
};

export default KNUSTMap;
