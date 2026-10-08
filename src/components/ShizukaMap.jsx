import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Compass, ExternalLink, Clock } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Shop Roastery Coordinates: Poblacion, Makati City, Metro Manila
const ROASTERY_COORDS = [14.5649, 121.0315];

// Preset Delivery Hubs in Metro Manila for interactive testing
const DELIVERY_PRESETS = [
  { name: "Poblacion (Local)", city: "Makati City", district: "Poblacion", coords: [14.5649, 121.0315], address: "12 Lantern Lane, Poblacion" },
  { name: "Makati CBD / Legazpi", city: "Makati City", district: "Legazpi Village", coords: [14.5547, 121.0185], address: "Legazpi Village, Makati" },
  { name: "BGC / High Street", city: "Taguig City", district: "Bonifacio Global City", coords: [14.5515, 121.0494], address: "Bonifacio High Street, BGC" },
  { name: "Rockwell Center", city: "Makati City", district: "Poblacion", coords: [14.5661, 121.0368], address: "Rockwell Center, Makati" },
  { name: "Mandaluyong", city: "Mandaluyong City", district: "Wack-Wack", coords: [14.5888, 121.0505], address: "Shaw Boulevard, Mandaluyong" },
  { name: "Ortigas Center", city: "Pasig City", district: "San Antonio", coords: [14.5866, 121.0617], address: "Emerald Avenue, Ortigas" },
  { name: "Quezon City / Diliman", city: "Quezon City", district: "Diliman", coords: [14.6537, 121.0685], address: "Katipunan Avenue, Quezon City" },
  { name: "Manila / Malate", city: "Manila", district: "Malate", coords: [14.5707, 120.9915], address: "Adriatico Street, Malate" }
];

// Calculate distance in kilometers using Haversine formula
function calculateDistanceKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function ShizukaMap({
  mode = "shop", // 'shop' | 'delivery' | 'tracking'
  selectedCoords = null,
  onLocationSelect = null,
  className = "h-[360px] w-full",
  containerClassName = "",
  interactive = true,
  deliveryAddress = ""
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLineRef = useRef(null);

  const [currentDeliveryCoords, setCurrentDeliveryCoords] = useState(
    selectedCoords || [14.5515, 121.0494] // Default: BGC
  );
  const [distanceKm, setDistanceKm] = useState(0);
  const [estimatedMins, setEstimatedMins] = useState(25);
  const [activePreset, setActivePreset] = useState("BGC / High Street");

  // Keep internal delivery coords synced with prop if provided
  useEffect(() => {
    if (selectedCoords && (selectedCoords[0] !== currentDeliveryCoords[0] || selectedCoords[1] !== currentDeliveryCoords[1])) {
      setCurrentDeliveryCoords(selectedCoords);
    }
  }, [selectedCoords]);

  // Recalculate distance and estimated transit time
  useEffect(() => {
    if (mode === "delivery" || mode === "tracking") {
      const dist = calculateDistanceKm(ROASTERY_COORDS, currentDeliveryCoords);
      setDistanceKm(dist);
      // Rough Manila courier delivery time: 15 mins base prep + 4 mins per km
      setEstimatedMins(Math.max(20, Math.round(dist * 4 + 15)));
    }
  }, [currentDeliveryCoords, mode]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy any existing instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = mode === "shop" ? ROASTERY_COORDS : currentDeliveryCoords;
    const initialZoom = mode === "shop" ? 15 : 13;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: interactive,
      scrollWheelZoom: false,
      attributionControl: false
    });

    // Primary: Elegant CartoDB Positron tile layer (clean, serene, warm-light aesthetic)
    const primaryTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(map);

    // Fallback: standard OSM if CartoDB tile server is unreachable
    primaryTiles.on("tileerror", () => {
      if (!map._hasOsmFallback) {
        map._hasOsmFallback = true;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(map);
      }
    });

    // Group for markers and paths
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Handle map clicks in delivery selection mode
    if (mode === "delivery" && interactive) {
      map.on("click", (e) => {
        const newCoords = [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))];
        setCurrentDeliveryCoords(newCoords);
        setActivePreset("Custom Map Pin");

        if (onLocationSelect) {
          const dist = calculateDistanceKm(ROASTERY_COORDS, newCoords);
          onLocationSelect({
            coords: newCoords,
            lat: newCoords[0],
            lng: newCoords[1],
            distanceKm: dist,
            estimatedMins: Math.max(20, Math.round(dist * 4 + 15))
          });
        }
      });
    }

    // Force tile recalculation after layout paints
    const timer1 = setTimeout(() => map.invalidateSize(), 60);
    const timer2 = setTimeout(() => map.invalidateSize(), 300);
    const timer3 = setTimeout(() => map.invalidateSize(), 800);

    // ResizeObserver ensures map updates smoothly whenever container changes
    let ro = null;
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      ro?.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mode, interactive]);

  // Render markers and route whenever coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. ROASTERY SHOP PIN
    const shopIcon = L.divIcon({
      className: "shizuka-shop-pin",
      iconSize: [160, 48],
      iconAnchor: [80, 48],
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#1A1613; color:#F5F1EA; padding:5px 10px; border-radius:3px; font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; border:1px solid #B8A995; box-shadow:0 4px 10px rgba(0,0,0,0.18); white-space:nowrap;">
            Shizuka Café
          </div>
          <div style="width:12px; height:12px; background:#1A1613; border:2px solid #F5F1EA; border-radius:50%; box-shadow:0 0 0 3px rgba(26,22,19,0.3); margin-top:-2px;"></div>
        </div>
      `
    });

    const shopMarker = L.marker(ROASTERY_COORDS, { icon: shopIcon });
    shopMarker.bindPopup(`
      <div style="font-family:'Jost', sans-serif; padding:4px;">
        <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px; font-weight:600; color:#1A1613; margin:0 0 4px 0;">SHIZUKA CAFÉ</p>
        <p style="font-size:12px; color:#8C8378; margin:0 0 6px 0;">12 Lantern Lane, Poblacion, Makati</p>
        <p style="font-size:11px; color:#2B211B; margin:0;"><strong>Hours:</strong> Mon–Fri 7:30–19:00 · Sat–Sun 8:00–20:00</p>
      </div>
    `);
    group.addLayer(shopMarker);

    if (mode === "shop") {
      map.setView(ROASTERY_COORDS, 15);
      return;
    }

    // 2. DELIVERY DESTINATION PIN
    if (mode === "delivery" || mode === "tracking") {
      const deliveryIcon = L.divIcon({
        className: "shizuka-delivery-pin",
        iconSize: [160, 48],
        iconAnchor: [80, 48],
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background:#8A9A82; color:#FFFFFF; padding:5px 9px; border-radius:3px; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; box-shadow:0 4px 10px rgba(0,0,0,0.16); white-space:nowrap;">
              Delivery Pin · ${distanceKm} km
            </div>
            <div style="width:12px; height:12px; background:#8A9A82; border:2px solid #FFFFFF; border-radius:50%; box-shadow:0 0 0 3px rgba(138,154,130,0.4); margin-top:-2px;"></div>
          </div>
        `
      });

      const deliveryMarker = L.marker(currentDeliveryCoords, {
        icon: deliveryIcon,
        draggable: mode === "delivery" && interactive
      });

      deliveryMarker.on("dragend", (e) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        const newCoords = [Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5))];
        setCurrentDeliveryCoords(newCoords);
        setActivePreset("Custom Dragged Pin");

        if (onLocationSelect) {
          const dist = calculateDistanceKm(ROASTERY_COORDS, newCoords);
          onLocationSelect({
            coords: newCoords,
            lat: newCoords[0],
            lng: newCoords[1],
            distanceKm: dist,
            estimatedMins: Math.max(20, Math.round(dist * 4 + 15))
          });
        }
      });

      group.addLayer(deliveryMarker);

      // 3. ROUTE LINE (Dashed zen aesthetic)
      const latlngs = [ROASTERY_COORDS, currentDeliveryCoords];
      const polyline = L.polyline(latlngs, {
        color: "#2B211B",
        weight: 3,
        opacity: 0.65,
        dashArray: "6, 8",
        lineCap: "round"
      });
      group.addLayer(polyline);

      // Fit bounds to show both roastery and delivery pin comfortably
      const bounds = L.latLngBounds(latlngs).pad(0.25);
      map.fitBounds(bounds, { animate: true, maxZoom: 15 });

      // 4. IN TRACKING MODE: Courier In-Transit Icon
      if (mode === "tracking") {
        // Place courier 60% along the path
        const courierLat = ROASTERY_COORDS[0] + (currentDeliveryCoords[0] - ROASTERY_COORDS[0]) * 0.62;
        const courierLng = ROASTERY_COORDS[1] + (currentDeliveryCoords[1] - ROASTERY_COORDS[1]) * 0.62;

        const courierIcon = L.divIcon({
          className: "shizuka-courier-pin",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          html: `
            <div style="width:34px; height:34px; border-radius:50%; background:#1A1613; border:2px solid #B8A995; color:#F5F1EA; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 4px 12px rgba(0,0,0,0.25);">
              ☕
            </div>
          `
        });

        const courierMarker = L.marker([courierLat, courierLng], { icon: courierIcon });
        courierMarker.bindPopup("<strong>Courier En Route</strong><br/>Carrying your freshly roasted beans.");
        group.addLayer(courierMarker);
      }
    }
  }, [currentDeliveryCoords, mode, distanceKm, interactive]);

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.name);
    setCurrentDeliveryCoords(preset.coords);

    const dist = calculateDistanceKm(ROASTERY_COORDS, preset.coords);
    if (onLocationSelect) {
      onLocationSelect({
        coords: preset.coords,
        lat: preset.coords[0],
        lng: preset.coords[1],
        city: preset.city,
        district: preset.district,
        address: preset.address,
        distanceKm: dist,
        estimatedMins: Math.max(20, Math.round(dist * 4 + 15))
      });
    }

    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([ROASTERY_COORDS, preset.coords]).pad(0.3);
      mapInstanceRef.current.fitBounds(bounds, { animate: true });
    }
  };

  const handleCenterShop = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(ROASTERY_COORDS, 16, { animate: true });
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", mode === "shop" ? "h-full" : "", containerClassName)}>
      {/* Interactive Delivery Presets (in delivery mode) */}
      {mode === "delivery" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow text-zen-charcoal flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-zen-clay" /> Tap map or choose delivery hub
            </span>
            <span className="text-xs text-zen-muted font-medium">
              {distanceKm} km · ~{estimatedMins} mins
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DELIVERY_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={cn(
                  "border px-2.5 py-1 text-xs transition-colors rounded-xs",
                  activePreset === p.name
                    ? "border-zen-charcoal bg-zen-charcoal text-zen-paper"
                    : "border-zen-hairline bg-zen-surface text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Canvas Frame */}
      <div className={cn("relative overflow-hidden border border-zen-hairline bg-zen-paper paper-grain min-h-[280px] w-full isolate", className)}>
        <div ref={mapContainerRef} className="h-full w-full z-0 min-h-[280px]" style={{ minHeight: "280px", height: "100%", width: "100%" }} />

        {/* Floating controls for Shop Location mode */}
        {mode === "shop" && (
          <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 bg-zen-paper/95 p-3 backdrop-blur-sm border border-zen-hairline text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zen-clay shrink-0" />
              <div>
                <p className="font-heading text-sm text-zen-charcoal leading-none">Shizuka Roastery</p>
                <p className="text-[11px] text-zen-muted mt-0.5">{site.address.line1}, {site.address.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCenterShop}
                className="border border-zen-hairline bg-zen-surface px-2.5 py-1 text-zen-charcoal hover:border-zen-charcoal transition-colors text-[11px]"
              >
                Center
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("12 Lantern Lane, Poblacion, Makati City")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-zen-charcoal px-3 py-1 text-zen-paper hover:bg-zen-espresso transition-colors text-[11px]"
              >
                Directions <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Delivery info overlay (in delivery or tracking mode) */}
        {(mode === "delivery" || mode === "tracking") && (
          <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-3 bg-zen-paper/95 px-3 py-2 backdrop-blur-sm border border-zen-hairline text-xs shadow-xs">
            <div className="flex items-center gap-1.5 text-zen-charcoal font-medium">
              <Navigation className="h-3.5 w-3.5 text-zen-sage" />
              <span>{distanceKm} km from roastery</span>
            </div>
            <span className="text-zen-hairline">|</span>
            <div className="flex items-center gap-1.5 text-zen-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>Est. transit ~{estimatedMins} mins</span>
            </div>
          </div>
        )}
      </div>

      {/* Helper caption */}
      {mode === "delivery" && (
        <p className="text-[11px] text-zen-muted">
          * Drag the green pin or tap anywhere on the map to set your precise drop-off location. Delivery radius covers Metro Manila (same-day courier dispatch).
        </p>
      )}
    </div>
  );
}
