import React, { useState, useRef, useEffect } from "react";
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

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function MapComponent({
  location = null,
  setLocation = null,
  Markers = [],
  editMode = false,
  userLocation = true,
  mapRef: externalMapRef = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const internalMapRef = useRef(null);
  const mapRef = externalMapRef ?? internalMapRef;

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

        {/* Business markers */}
        {Markers.map((marker) =>
          marker.latitude != null && marker.longitude != null ? (
            <MapMarker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
            >
              <MarkerContent>
                {marker.logo ? (
                  <div className="w-9 h-9 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform overflow-hidden bg-white">
                    <img
                      src={`${media_url}${marker.logo}`}
                      alt={marker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {marker.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </MarkerContent>
              <MarkerTooltip>{marker.name}</MarkerTooltip>
              <MarkerPopup>
                <div className="flex items-center gap-2 p-2">
                  {marker.logo ? (
                    <img
                      src={`${media_url}${marker.logo}`}
                      alt={marker.name}
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {marker.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{marker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                    </p>
                  </div>
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