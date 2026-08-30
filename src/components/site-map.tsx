"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

export type MapMarker = {
  position: [number, number];
  label: string;
  /** "venue" — small line-art atrium icon. "star" — gold star pin. "label" —
   * no icon at all, just a quiet permanent text label (for naming a town). */
  type: "venue" | "star" | "label";
  /** Renders the label permanently next to the marker instead of on hover. Implied for type "label". */
  showLabel?: boolean;
};

const starIcon = L.divIcon({
  className: "",
  html: `<svg width="26" height="26" viewBox="0 0 24 24" style="filter: drop-shadow(0 1px 2px rgba(58,15,24,0.35))">
    <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z"
      fill="#c9a876" stroke="#4a1521" stroke-width="0.75" stroke-linejoin="round"/>
  </svg>`,
  iconSize: [26, 26],
  iconAnchor: [13, 24],
  tooltipAnchor: [0, -20],
});

const venueIcon = L.icon({
  iconUrl: "/brand/venue-marker.png",
  iconSize: [88, 42],
  iconAnchor: [44, 30],
  tooltipAnchor: [0, -26],
});

// Invisible 1x1 anchor — used for plain town labels that shouldn't show a pin.
const blankIcon = L.divIcon({ className: "", html: "", iconSize: [1, 1], iconAnchor: [0, 0], tooltipAnchor: [6, 0] });

export function SiteMap({
  center,
  zoom,
  markers,
  heightClassName = "h-[420px]",
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  heightClassName?: string;
}) {
  return (
    <div
      className={`relative w-full ${heightClassName} overflow-hidden rounded-sm border border-gold-400/25 [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution]:bg-cream-100/80`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
        // A warm, low-saturation basemap reads much closer to the site's
        // cream/burgundy palette than the default OSM blue-and-yellow tiles.
        style={{ filter: "sepia(18%) saturate(65%) brightness(1.05) contrast(0.95)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => {
          const icon = m.type === "venue" ? venueIcon : m.type === "label" ? blankIcon : starIcon;
          const permanent = m.type === "label" ? true : m.showLabel;
          return (
            <Marker key={m.label} position={m.position} icon={icon} interactive={m.type !== "label"}>
              <Tooltip
                direction={m.type === "label" ? "right" : "top"}
                offset={m.type === "label" ? [4, 0] : [0, -4]}
                permanent={permanent}
                opacity={1}
                className={
                  m.type === "label"
                    ? "!font-serif !italic !text-burgundy-600/70 !border-none !bg-transparent !shadow-none !px-0"
                    : "!font-serif !italic !text-burgundy-600 !border-gold-400/40 !bg-cream-100/95 !shadow-none"
                }
              >
                {m.label}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
