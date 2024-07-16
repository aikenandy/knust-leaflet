import React, { useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import axios from 'axios';

const SearchControl = ( {setSearchResult }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      updateMap: false,
    });

    map.addControl(searchControl);


    map.on('geosearch/showlocation', async (result) => {
        const query = result.location.label;
        try {
          const response = await axios.get(`http://localhost:8080/search?name=${query}`);
          if (response.data.length > 0) {
            const { latitude, longitude, name } = response.data[0];
            setSearchResult({ lat: latitude, lng: longitude, name: name });
            map.setView([latitude, longitude], 18);
          } else {
            alert("Building not found");
          }
        } catch (error) {
          console.error("Error fetching search result", error);
        }
      });
  
      return () => map.removeControl(searchControl);
    }, [map, setSearchResult]);
  
    return null;
  };
  
export default SearchControl;
  
