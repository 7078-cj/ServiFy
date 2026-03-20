import React, { useState, useRef, useEffect } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import { MapEventListener } from "../../utils/mapUtils/mapEventListener";
import { handleSearch } from "../../utils/mapUtils/map";
import SearchInput from "../SearchInput";

export default function MapComponent({ location, setLocation, Markers = [], editMode = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);


  
  useEffect(()=>{
      mapRef.current?.flyTo({ center: [parseFloat(location?.lng), parseFloat(location?.lat)], zoom: 16 });
  },[location])
  return (
    <div className="h-[80vh] w-full relative">
      {/* Search input */}
      <SearchInput 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        action={() => handleSearch(searchQuery, setLocation, mapRef)}
      />

      <Map
        ref={mapRef}
        center={[120.75886839058785, 14.949553352698302]}
        zoom={16}
        styles={{
          light: "https://tiles.openfreemap.org/styles/bright",
          dark: "https://tiles.openfreemap.org/styles/bright",
        }}
      >
        <MapEventListener setLocation={setLocation} editMode={editMode} />

        {Markers.map((marker) => (
          <MapMarker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <MarkerContent>
              <div className="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
            </MarkerContent>
            <MarkerTooltip>{marker.name}</MarkerTooltip>
            <MarkerPopup>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{marker.name}</p>
                <p className="text-xs text-muted-foreground">
                  {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}


        {location?.lat && location?.lng && (
          <MapMarker longitude={location.lng} latitude={location.lat}>
            <MarkerContent>
              <div className="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
            </MarkerContent>
            <MarkerPopup>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{location.full}</p>
                <p className="text-xs text-muted-foreground">
                  {location.lat}, {location.lng}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        )}
      </Map>

      <div className="mt-4">
        <pre>{JSON.stringify(location, null, 2)}</pre>
      </div>
    </div>
  );
}