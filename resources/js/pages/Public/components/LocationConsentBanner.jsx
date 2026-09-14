import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Cookie, MapPin, ShieldCheck, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocationConsentBanner({ isDarkTheme = false, companyName = "ARTDEVATA" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const STORAGE_KEY = "artdevata_location_cookie_consent_v1";

  useEffect(() => {
    // Check if user has already made a choice previously
    const existingConsent = localStorage.getItem(STORAGE_KEY);
    if (!existingConsent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const sendConsentLog = (payload) => {
    return new Promise((resolve) => {
      router.post("/public/log-consent", payload, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => resolve(true),
        onError: () => resolve(false),
      });
    });
  };

  const handleAllowLocationAndCookie = () => {
    setIsProcessing(true);
    setStatusMessage("Meminta izin GPS perangkat...");

    if (!navigator.geolocation) {
      // Geolocation not supported by browser
      sendConsentLog({
        status: "LOCATION_DENIED",
        error: "Browser tidak mendukung fitur geolokasi GPS",
      });
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: "UNSUPPORTED", date: new Date().toISOString() })
      );
      setIsProcessing(false);
      setIsVisible(false);
      return;
    }

    // High accuracy GPS acquisition strategy:
    // We try to acquire the most accurate position available within 8 seconds
    let bestPosition = null;
    let watchId = null;

    const finalizePosition = async (position) => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }

      setStatusMessage("Menghubungkan titik GPS & alamat detail...");
      const { latitude, longitude, accuracy, altitude, speed } = position.coords;

      let detectedAddress = "";
      let detectedCity = "";
      let detectedDistrict = "";
      let detectedProvince = "";
      let detectedPostcode = "";

      try {
        // High-precision reverse geocoding (Zoom 18 for street-level accuracy)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "id,en",
            },
          }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data?.address) {
            const addr = data.address;
            const road = addr.road || addr.pedestrian || addr.street || addr.footway || "";
            const village = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || "";
            const district = addr.city_district || addr.subdistrict || addr.county || "";
            const city = addr.city || addr.town || addr.municipality || "";
            const province = addr.state || addr.province || addr.region || "";
            const postcode = addr.postcode || "";

            const addressParts = [
              road,
              village,
              district ? `Kec. ${district}` : "",
              city,
              province,
              postcode,
            ].filter(Boolean);

            detectedAddress = addressParts.join(", ") || data.display_name || "";
            detectedCity = city || district || "";
            detectedDistrict = district || "";
            detectedProvince = province || "";
            detectedPostcode = postcode || "";
          }
        }
      } catch (e) {
        // Fallback gracefully if reverse geocoding is unavailable
      }

      await sendConsentLog({
        status: "LOCATION_ALLOWED",
        latitude: Number(latitude.toFixed(7)),
        longitude: Number(longitude.toFixed(7)),
        accuracy: Math.round(accuracy),
        altitude: altitude ? Math.round(altitude) : null,
        speed: speed ? Number(speed.toFixed(2)) : null,
        address: detectedAddress || `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: detectedCity,
        district: detectedDistrict,
        province: detectedProvince,
        postcode: detectedPostcode,
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: "ALLOWED",
          coords: { latitude, longitude, accuracy: Math.round(accuracy) },
          address: detectedAddress,
          date: new Date().toISOString(),
        })
      );

      setIsProcessing(false);
      setIsVisible(false);
    };

    const handleGpsError = async (error) => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }

      // If we already captured a position before error, use it
      if (bestPosition) {
        await finalizePosition(bestPosition);
        return;
      }

      let errorMsg = "Akses lokasi ditolak pengguna";
      if (error.code === 2) errorMsg = "Posisi lokasi GPS tidak dapat ditentukan";
      if (error.code === 3) errorMsg = "Batas waktu permintaan lokasi habis (Timeout)";

      await sendConsentLog({
        status: "LOCATION_DENIED",
        error: errorMsg,
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: "DENIED", date: new Date().toISOString() })
      );

      setIsProcessing(false);
      setIsVisible(false);
    };

    // Watch for GPS satellite lock to get highest accuracy (accuracy < 30m or best within timeout)
    const gpsTimeout = setTimeout(() => {
      if (bestPosition) {
        finalizePosition(bestPosition);
      }
    }, 6000);

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!bestPosition || pos.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = pos;
        }

        // If accuracy is high enough (<= 25 meters), finalize immediately
        if (pos.coords.accuracy <= 25) {
          clearTimeout(gpsTimeout);
          finalizePosition(pos);
        }
      },
      (err) => {
        clearTimeout(gpsTimeout);
        handleGpsError(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleBasicCookiesOnly = async () => {
    setIsProcessing(true);
    await sendConsentLog({
      status: "COOKIE_ACCEPTED",
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status: "COOKIE_ONLY", date: new Date().toISOString() })
    );

    setIsProcessing(false);
    setIsVisible(false);
  };

  const handleRejectAll = async () => {
    setIsProcessing(true);
    await sendConsentLog({
      status: "COOKIE_REJECTED",
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status: "REJECTED", date: new Date().toISOString() })
    );

    setIsProcessing(false);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div
        className={`p-5 rounded-3xl shadow-2xl border backdrop-blur-xl transition-all ${
          isDarkTheme
            ? "bg-[#071f1b]/95 border-[#21C9A4]/30 text-[#F5F7F6] shadow-black/60 ring-1 ring-[#21C9A4]/20"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/15"
        }`}
      >
        {/* Header Icon & Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#21C9A4]/15 flex items-center justify-center text-[#21C9A4] shrink-0 border border-[#21C9A4]/30 shadow-xs">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                <span>Preferensi Cookie & Akses Lokasi</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#21C9A4] animate-pulse" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {companyName} Photography Experience
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRejectAll}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors"
            title="Tutup & Tolak"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description Body */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Kami meminta izin akses lokasi perangkat dan cookie untuk memberikan estimasi jarak lokasi foto, rekomendasi spot pemotretan terdekat di Bali, dan peningkatan kualitas layanan.
        </p>

        {/* Status Loading Note */}
        {isProcessing && statusMessage && (
          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-[#21C9A4] bg-[#21C9A4]/10 px-3 py-1.5 rounded-xl">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Actions Button Group */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-100 dark:border-white/10">
          <Button
            type="button"
            disabled={isProcessing}
            onClick={handleAllowLocationAndCookie}
            className="bg-[#21C9A4] hover:bg-[#1db896] text-[#092722] font-black text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#21C9A4]/25 cursor-pointer flex-1"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 shrink-0" />
            )}
            <span>Izinkan Lokasi & Cookie</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={handleBasicCookiesOnly}
            className={`text-xs h-9 px-3 rounded-xl border font-semibold cursor-pointer ${
              isDarkTheme
                ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Cookie Dasar Saja
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={isProcessing}
            onClick={handleRejectAll}
            className="text-xs h-9 px-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
          >
            Tolak
          </Button>
        </div>
      </div>
    </div>
  );
}
