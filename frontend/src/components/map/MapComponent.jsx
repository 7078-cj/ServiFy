import React, { useState, useRef, useEffect, use } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { MapEventListener } from "../../utils/mapUtils/mapEventListener";
import { handleSearch } from "../../utils/mapUtils/map";
import SearchInput from "../SearchInput";

export default function MapComponent({ location = null, setLocation = null, Markers = [], editMode = false, userLocation = true }) {
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (location?.lat != null && location?.lng != null) {
      mapRef.current?.flyTo({
        center: [parseFloat(location.lng), parseFloat(location.lat)],
        zoom: 16,
      });
    }
  }, [location]);

  useEffect(() => {
    if (userLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 16,
        });
      });
    }
  }, [userLocation]);

  return (
    <>
      {/* Search input */}
      {location && (
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          action={() => handleSearch(searchQuery, setLocation, mapRef)}
        />
      )}

      <Map
        ref={mapRef}
        center={[120.75886839058785, 14.949553352698302]}
        zoom={16}
        styles={{
          light: "https://tiles.openfreemap.org/styles/bright",
          dark: "https://tiles.openfreemap.org/styles/bright",
        }}
      >
        {location && <MapEventListener setLocation={setLocation} editMode={editMode} />}

        {/* Render markers */}
        {Markers.map((marker) =>
          marker.latitude != null && marker.longitude != null ? (
            <MapMarker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
            >
              <MarkerContent>
                <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
              </MarkerContent>
              <MarkerTooltip>{marker.name}</MarkerTooltip>
              <MarkerPopup>
                <div className="space-y-1 p-2">
                  <p className="font-medium text-foreground">{marker.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          ) : null
        )}

        {/* Current location marker */}
        {location?.lat != null && location?.lng != null && (
          <MapMarker longitude={location.lng} latitude={location.lat}>
            <MarkerContent>
              <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
            </MarkerContent>
            <MarkerPopup>
              <div className="space-y-1 p-2">
                <p className="font-medium text-foreground">{location.full}</p>
                <p className="text-xs text-muted-foreground">
                  {parseFloat(location.lat).toFixed(4)}, {parseFloat(location.lng).toFixed(4)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        )}
      </Map>
    </>
  );
}