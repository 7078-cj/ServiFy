import React from 'react'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { MapEventListener } from '../../utils/mapUtils/mapEventListener';


export default function MapComponent({location, setLocation, Markers=[], editMode=false}) {


  return (
      <div className="h-[700px] w-full">
            {/* [lng, lat] */}
            <Map 
              center={[120.75886839058785, 14.949553352698302]} 
              zoom={16}
              styles={{ light: "https://tiles.openfreemap.org/styles/bright", dark: "https://tiles.openfreemap.org/styles/bright" }}
            >
              <MapEventListener setLocation={setLocation} editMode={editMode} />

              {Markers.map((location) => (
                  <MapMarker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                  >
                    <MarkerContent>
                      <div className="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                    </MarkerContent>
                    <MarkerTooltip>{location.name}</MarkerTooltip>
                    <MarkerPopup>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{location.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                ))
              }
    
            </Map>
            <div className="mt-4">
              <pre>{JSON.stringify(location, null, 2)}</pre>
            </div>
      </div>
  )
}
