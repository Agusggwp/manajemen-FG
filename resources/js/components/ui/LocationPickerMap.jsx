import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Custom SVG Marker Icon so Leaflet icons always render cleanly without missing asset paths
const createCustomIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e11d48" width="36" height="36" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "custom-leaflet-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function LocationPickerMap({
  latitude = -8.671234,
  longitude = 115.215678,
  radius = 100,
  onLocationSelect,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const parsedLat = parseFloat(latitude) || -8.671234;
  const parsedLng = parseFloat(longitude) || 115.215678;
  const parsedRadius = parseInt(radius) || 100;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [parsedLat, parsedLng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(map);

      const customIcon = createCustomIcon();

      const marker = L.marker([parsedLat, parsedLng], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);

      const circle = L.circle([parsedLat, parsedLng], {
        color: "#e11d48",
        fillColor: "#f43f5e",
        fillOpacity: 0.15,
        radius: parsedRadius,
      }).addTo(map);

      markerRef.current = marker;
      circleRef.current = circle;
      mapInstanceRef.current = map;

      // Handle Marker Drag
      marker.on("dragend", async (e) => {
        const position = e.target.getLatLng();
        map.panTo(position);
        circle.setLatLng(position);
        await triggerLocationUpdate(position.lat, position.lng);
      });

      // Handle Click on Map
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        await triggerLocationUpdate(lat, lng);
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when lat, lng, or radius props change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && circleRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - parsedLat) > 0.00001 || Math.abs(currentPos.lng - parsedLng) > 0.00001) {
        const newLatLng = [parsedLat, parsedLng];
        markerRef.current.setLatLng(newLatLng);
        circleRef.current.setLatLng(newLatLng);
        mapInstanceRef.current.panTo(newLatLng);
      }
      circleRef.current.setRadius(parsedRadius);
    }
  }, [parsedLat, parsedLng, parsedRadius]);

  // Reverse Geocoding helper
  const triggerLocationUpdate = async (lat, lng) => {
    setStatusMessage("Mengambil detail alamat lokasi...");
    let address = "";
    let locationName = "";

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "User-Agent": "ArtdevataManajemenFG/1.0" } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          address = data.display_name;
          locationName =
            data.address?.amenity ||
            data.address?.building ||
            data.address?.shop ||
            data.address?.tourism ||
            data.address?.leisure ||
            data.address?.road ||
            "";
        }
      }
    } catch (err) {
      console.warn("Geocoding failed:", err);
    } finally {
      setStatusMessage("");
    }

    if (onLocationSelect) {
      onLocationSelect({
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        address: address,
        name: locationName,
      });
    }
  };

  // Forward Search
  const handleSearchSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage("Mencari tempat...");
    try {
      const query = encodeURIComponent(searchQuery);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        { headers: { "User-Agent": "ArtdevataManajemenFG/1.0" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        if (mapInstanceRef.current && markerRef.current && circleRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16);
          markerRef.current.setLatLng([newLat, newLng]);
          circleRef.current.setLatLng([newLat, newLng]);
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat: Number(newLat.toFixed(6)),
            lng: Number(newLng.toFixed(6)),
            address: result.display_name || "",
            name: searchQuery,
          });
        }
        setStatusMessage("Lokasi ditemukan!");
      } else {
        setStatusMessage("Lokasi tidak ditemukan. Coba kata kunci lain.");
      }
    } catch (err) {
      setStatusMessage("Gagal mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  // Get Current Device GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation GPS.");
      return;
    }

    setIsLocating(true);
    setStatusMessage("Mengambil GPS perangkat...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current && markerRef.current && circleRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
          circleRef.current.setLatLng([lat, lng]);
        }

        await triggerLocationUpdate(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        console.error("GPS error:", error);
        setStatusMessage("Gagal mendapatkan lokasi GPS.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari lokasi di peta (misal: Pantai Kuta, Renon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchSubmit(e);
                }
              }}
              className="pl-9 bg-white text-xs"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isSearching}
            onClick={handleSearchSubmit}
          >
            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cari"}
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="whitespace-nowrap text-xs flex items-center gap-1.5 w-full sm:w-auto"
        >
          {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5 text-blue-600" />}
          <span>Lokasi Saya</span>
        </Button>
      </div>

      {statusMessage && <p className="text-[11px] text-amber-700 italic px-1">{statusMessage}</p>}

      {/* Map Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-64 sm:h-72" />
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-200 text-[11px] font-mono text-slate-700 pointer-events-none z-50 shadow-xs flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-rose-600" />
          <span>Lat: {parsedLat.toFixed(6)}, Lng: {parsedLng.toFixed(6)}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 italic">
        💡 <strong>Petunjuk:</strong> Klik area mana saja di peta atau geser pin merah untuk memperbarui koordinat Latitude & Longitude secara otomatis.
      </p>
    </div>
  );
}
