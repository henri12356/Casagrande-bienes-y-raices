"use client";

import L, { type LatLngExpression } from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

export type CroquisPointType = "origin" | "sector" | "project";

export type CroquisPoint = {
  id: string;
  name: string;
  shortName: string;
  type: CroquisPointType;
  coordinates: [number, number];
  subtitle: string;
  googleMapsUrl: string;
};

type CroquisMapProps = {
  points: CroquisPoint[];
  selectedId: string;
  routeCoordinates: [number, number][];
  routeOriginId: string;
  pendingOriginId?: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
};

type MarkerRole = "origin" | "destination" | "pending" | "normal";

const MAP_CENTER: LatLngExpression = [-13.1438, -74.2445];

function markerLabel(point: CroquisPoint) {
  if (point.id === "plaza-mayor") return "P";
  if (point.id === "grifo-ayacucho") return "G";
  if (point.id === "sector-ccorihuillca") return "S";
  if (point.id === "ccorihuillca-chico") return "C";

  return point.shortName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function createMarkerIcon(point: CroquisPoint, role: MarkerRole) {
  return L.divIcon({
    className: "croquis-div-icon",
    html: `
      <div class="croquis-map-pin croquis-map-pin--${point.type} is-${role}">
        <span class="croquis-map-pin__role">${
          role === "origin"
            ? "A"
            : role === "destination"
              ? "B"
              : role === "pending"
                ? "1"
                : ""
        }</span>
        <span class="croquis-map-pin__pulse"></span>
        <span class="croquis-map-pin__body">${markerLabel(point)}</span>
        <span class="croquis-map-pin__tip"></span>
      </div>
    `,
    iconSize: [50, 62],
    iconAnchor: [25, 57],
    popupAnchor: [0, -52],
    tooltipAnchor: [0, -49],
  });
}

function MapViewport({
  selected,
  routeCoordinates,
}: {
  selected?: CroquisPoint;
  routeCoordinates: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();

      if (routeCoordinates.length >= 2) {
        map.fitBounds(routeCoordinates, {
          paddingTopLeft: [70, 205],
          paddingBottomRight: [70, 155],
          maxZoom: 15,
          animate: true,
          duration: 0.9,
        });
        return;
      }

      if (selected) {
        map.flyTo(selected.coordinates, selected.type === "project" ? 16 : 15, {
          animate: true,
          duration: 0.9,
        });
      }
    }, 90);

    return () => window.clearTimeout(timer);
  }, [map, routeCoordinates, selected]);

  return null;
}

function MapInteractions({
  onClearSelection,
}: {
  onClearSelection: () => void;
}) {
  useMapEvents({
    dblclick: () => onClearSelection(),
  });

  return null;
}

export default function CroquisMap({
  points,
  selectedId,
  routeCoordinates,
  routeOriginId,
  pendingOriginId,
  onSelect,
  onClearSelection,
}: CroquisMapProps) {
  const selected = points.find((point) => point.id === selectedId);
  const routeOrigin = points.find((point) => point.id === routeOriginId);

  const markers = useMemo(
    () =>
      points.map((point) => {
        const role: MarkerRole =
          point.id === pendingOriginId
            ? "pending"
            : point.id === routeOriginId
              ? "origin"
              : point.id === selectedId
                ? "destination"
                : "normal";

        return {
          point,
          role,
          icon: createMarkerIcon(point, role),
        };
      }),
    [points, selectedId, routeOriginId, pendingOriginId],
  );

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={13}
      minZoom={11}
      maxZoom={18}
      zoomSnap={0.5}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={90}
      zoomControl={false}
      doubleClickZoom={false}
      scrollWheelZoom
      className="h-full w-full"
      preferCanvas
    >
      <TileLayer
        attribution="Imágenes &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        minZoom={11}
        maxNativeZoom={16}
        maxZoom={18}
        keepBuffer={4}
        updateWhenZooming={false}
        updateWhenIdle
        crossOrigin
      />

      <ZoomControl position="bottomleft" />
      <MapInteractions onClearSelection={onClearSelection} />
      <MapViewport selected={selected} routeCoordinates={routeCoordinates} />

      {routeCoordinates.length >= 2 && (
        <>
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#ffffff",
              weight: 5.5,
              opacity: 0.88,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={routeCoordinates}
            className="croquis-route-line"
            pathOptions={{
              color: "#F5AA17",
              weight: 2.75,
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
              dashArray: "2 10",
            }}
          />
        </>
      )}

      {markers.map(({ point, icon, role }) => (
        <Marker
          key={point.id}
          position={point.coordinates}
          icon={icon}
          eventHandlers={{
            click: () => onSelect(point.id),
            dblclick: (event) => {
              L.DomEvent.stopPropagation(event.originalEvent);
              onClearSelection();
            },
          }}
          zIndexOffset={role === "pending" ? 1300 : role === "destination" ? 1200 : role === "origin" ? 1100 : 0}
        >
          <Tooltip
            permanent={point.type === "project"}
            direction="top"
            opacity={1}
            className={`croquis-marker-label ${
              point.type === "project"
                ? "croquis-marker-label--project"
                : "croquis-marker-label--reference"
            }`}
          >
            {point.shortName}
          </Tooltip>

          {point.type === "project" && (
            <Popup minWidth={210} className="croquis-popup">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#C88A16]">
                  Proyecto
                </p>
                <h3 className="text-base font-black text-slate-950">
                  {point.name}
                </h3>
                {routeOrigin && point.id !== routeOrigin.id && (
                  <p className="text-xs font-semibold text-slate-500">
                    Desde {routeOrigin.shortName}
                  </p>
                )}
                <a
                  href={point.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg bg-[#123B68] px-3 py-2 text-xs font-black text-white"
                >
                  Abrir ubicación
                </a>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}