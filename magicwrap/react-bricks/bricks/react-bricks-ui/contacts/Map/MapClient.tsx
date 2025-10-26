'use client'

import { Map, Marker } from 'pigeon-maps'
import { maptiler } from 'pigeon-maps/providers'
import React from 'react'

export interface MapProps {
  zoom: string
  lat: string
  lng: string
  mapTilerAccessToken: string
}

export const MapClient: React.FC<MapProps> = ({
  lat = '45.6782509',
  lng = '9.5669407',
  zoom = '10',
  mapTilerAccessToken,
}) => {
  const mapTilerProvider = React.useCallback(
    (x: number, y: number, z: number, dpr?: number | undefined) =>
      maptiler(mapTilerAccessToken, 'streets')(x, y, z, dpr),
    [mapTilerAccessToken]
  )

  let mapTilerProviderProp = {}

  if (mapTilerAccessToken) {
    mapTilerProviderProp = {
      provider: mapTilerProvider,
    }
  }

  return (
    <Map
      center={[parseFloat(lat), parseFloat(lng)]}
      height={350}
      metaWheelZoom
      zoom={parseInt(zoom, 10)}
      {...mapTilerProviderProp}
      dprs={[1, 2]}
      metaWheelZoomWarning="Use ctrl + wheel to zoom!"
      attribution={false}
    >
      <Marker anchor={[parseFloat(lat), parseFloat(lng)]} />
    </Map>
  )
}

export default MapClient
