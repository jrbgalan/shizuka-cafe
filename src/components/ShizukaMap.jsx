import { MapPin, Navigation, Compass, ExternalLink, Clock, Check } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Shop Roastery Coordinates: Poblacion, Makati City, Metro Manila
const ROASTERY_COORDS = [14.5649, 121.0315];
const ROASTERY_LABEL = "Shizuka Café Roastery";

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

/**
 * ShizukaMap — Powered by Official Google Maps (Zero API Key Embed)
 *
 * Supported modes:
 * - 'shop': Highlights the Shizuka Roastery café in Poblacion, Makati
 * - 'delivery': Interactive Metro Manila delivery hub selector with distance calculator
 * - 'tracking': Courier route visualization from Roastery to recipient
 */
export default function ShizukaMap({
  mode = "shop", // 'shop' | 'delivery' | 'tracking'
  selectedCoords = null,
  onLocationSelect = null,
  className = "h-[360px] w-full",
  containerClassName = "",
  interactive = true,
  deliveryAddress = ""
}) {
  const [currentCoords, setCurrentCoords] = useState(
    selectedCoords || (mode === "shop" ? ROASTERY_COORDS : [14.5515, 121.0494])
  );
  const [activePreset, setActivePreset] = useState("BGC / High Street");
  const [mapType, setMapType] = useState("roadmap"); // 'roadmap' | 'satellite'
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // Sync internal coords if prop updates
  useEffect(() => {
    if (selectedCoords && (selectedCoords[0] !== currentCoords[0] || selectedCoords[1] !== currentCoords[1])) {
      setCurrentCoords(selectedCoords);
    }
  }, [selectedCoords]);

  // Compute distance and courier transit time
  const distanceKm = calculateDistanceKm(ROASTERY_COORDS, currentCoords);
  const estimatedMins = Math.max(20, Math.round(distanceKm * 4 + 15));

  // Build the zero-API-key Google Maps Embed URL
  const buildGoogleMapsEmbedUrl = () => {
    const tParam = mapType === "satellite" ? "k" : "m";

    if (mode === "shop") {
      // Roastery pin view
      const query = encodeURIComponent(`${ROASTERY_COORDS[0]},${ROASTERY_COORDS[1]} (${ROASTERY_LABEL})`);
      return `https://maps.google.com/maps?q=${query}&t=${tParam}&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    if (mode === "tracking") {
      // Turn-by-turn route from Roastery to Delivery Pin
      const saddr = `${ROASTERY_COORDS[0]},${ROASTERY_COORDS[1]}`;
      const daddr = `${currentCoords[0]},${currentCoords[1]}`;
      return `https://maps.google.com/maps?saddr=${saddr}&daddr=${daddr}&t=${tParam}&z=13&ie=UTF8&output=embed`;
    }

    // Delivery mode: Pin on customer's selected drop-off area
    const dropoffLabel = encodeURIComponent(
      activePreset ? `Shizuka Drop-off: ${activePreset}` : "Delivery Drop-off"
    );
    const query = `${currentCoords[0]},${currentCoords[1]} (${dropoffLabel})`;
    return `https://maps.google.com/maps?q=${query}&t=${tParam}&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  // Open location directly on native Google Maps app / web
  const getGoogleMapsDirectUrl = () => {
    if (mode === "shop") {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("12 Lantern Lane, Poblacion, Makati City")}`;
    }
    if (mode === "tracking") {
      return `https://www.google.com/maps/dir/?api=1&origin=${ROASTERY_COORDS.join(",")}&destination=${currentCoords.join(",")}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${currentCoords[0]},${currentCoords[1]}`;
  };

  // Handle Preset selection in delivery mode
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.name);
    setCurrentCoords(preset.coords);
    setIsIframeLoading(true);

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
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", mode === "shop" ? "h-full" : "", containerClassName)}>
      {/* Interactive Delivery Presets Bar (Delivery Mode) */}
      {mode === "delivery" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow text-zen-charcoal flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-zen-clay" /> Choose Metro Manila delivery hub
            </span>
            <span className="text-xs text-zen-muted font-medium">
              {distanceKm} km · ~{estimatedMins} mins
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DELIVERY_PRESETS.map((p) => {
              const isActive = activePreset === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={cn(
                    "border px-2.5 py-1 text-xs transition-colors rounded-xs flex items-center gap-1",
                    isActive
                      ? "border-zen-charcoal bg-zen-charcoal text-zen-paper shadow-2xs"
                      : "border-zen-hairline bg-zen-surface text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
                  )}
                >
                  {isActive && <Check className="h-3 w-3 text-zen-clay" />}
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Map Frame */}
      <div className={cn("relative overflow-hidden rounded-2xl border border-zen-hairline/80 bg-zen-surface/40 shadow-2xs isolate", className)}>
        {/* Loading Skeleton & Zen Watermark */}
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zen-paper/90 backdrop-blur-xs transition-opacity duration-300">
            <div className="flex items-center gap-2 text-zen-charcoal">
              <span className="h-2 w-2 rounded-full bg-zen-clay animate-ping" />
              <p className="font-heading text-base tracking-wide">Loading Google Map...</p>
            </div>
            <p className="text-[11px] text-zen-muted mt-1">Poblacion, Makati · Metro Manila</p>
          </div>
        )}

        {/* Official Google Maps Iframe (Zero API Key) */}
        <iframe
          key={`${currentCoords[0]}-${currentCoords[1]}-${mapType}-${mode}`}
          title="Google Map — Shizuka Café"
          src={buildGoogleMapsEmbedUrl()}
          className="h-full w-full border-0 transition-opacity duration-500"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsIframeLoading(false)}
          style={{ minHeight: "260px" }}
          allowFullScreen
        />

        {/* Map Type Toggle: Roadmap vs Satellite (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-zen-hairline/80 bg-zen-paper/95 p-1 shadow-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMapType("roadmap")}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              mapType === "roadmap"
                ? "bg-zen-charcoal text-zen-paper"
                : "text-zen-muted hover:text-zen-charcoal"
            )}
            title="Google Road Map"
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              mapType === "satellite"
                ? "bg-zen-charcoal text-zen-paper"
                : "text-zen-muted hover:text-zen-charcoal"
            )}
            title="Google Satellite Imagery"
          >
            Satellite
          </button>
        </div>

        {/* Floating Info Overlay for Shop Location mode */}
        {mode === "shop" && (
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zen-hairline/80 bg-zen-paper/95 p-3 shadow-xs backdrop-blur-md text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zen-charcoal text-zen-paper shrink-0">
                <MapPin className="h-4 w-4 text-zen-clay" />
              </div>
              <div>
                <p className="font-heading text-base text-zen-charcoal leading-none">Shizuka Roastery</p>
                <p className="text-[11px] text-zen-muted mt-0.5">{site.address.line1}, {site.address.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getGoogleMapsDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-zen-charcoal px-3.5 py-1.5 text-zen-paper hover:bg-zen-espresso transition-colors text-[11px] font-medium shadow-2xs"
              >
                Directions <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Floating Info Overlay for Delivery or Tracking mode */}
        {(mode === "delivery" || mode === "tracking") && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-xl border border-zen-hairline/80 bg-zen-paper/95 px-3 py-2 shadow-xs backdrop-blur-md text-xs">
            <div className="flex items-center gap-1.5 text-zen-charcoal font-medium">
              <Navigation className="h-3.5 w-3.5 text-zen-sage" />
              <span>{distanceKm} km from roastery</span>
            </div>
            <span className="text-zen-hairline">|</span>
            <div className="flex items-center gap-1.5 text-zen-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>Est. transit ~{estimatedMins} mins</span>
            </div>
            <a
              href={getGoogleMapsDirectUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-zen-charcoal underline hover:text-zen-espresso ml-1"
            >
              Google Maps
            </a>
          </div>
        )}
      </div>

      {/* Helper caption */}
      {mode === "delivery" && (
        <p className="text-[11px] text-zen-muted">
          * Switch delivery hubs above to preview courier dispatch distance and transit times across Metro Manila via Google Maps.
        </p>
      )}
    </div>
  );
}
