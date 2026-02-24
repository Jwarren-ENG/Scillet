import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PLACES_KEY = Deno.env.get("GOOGLE_PLACES_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const categoryToType: Record<string, string> = {
  healthy: "health",
  american: "restaurant",
  mexican: "mexican_restaurant",
  italian: "italian_restaurant",
  asian: "chinese_restaurant",
  desserts: "bakery",
  bars: "bar",
};

const typeToLabel: Record<string, string> = {
  mexican_restaurant: "Mexican",
  italian_restaurant: "Italian",
  chinese_restaurant: "Asian",
  bar: "Bar & Drinks",
  bakery: "Bakery & Desserts",
  health: "Healthy",
  restaurant: "American",
};

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius = 10, category = "all" } = await req.json();
    const radiusMeters = Math.min(Math.round(radius * 1609.34), 50000);
    const type = category !== "all" ? (categoryToType[category] ?? "restaurant") : "restaurant";

    const placesUrl =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}&radius=${radiusMeters}&type=${type}&key=${PLACES_KEY}`;

    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    if (placesData.status === "REQUEST_DENIED") {
      return new Response(
        JSON.stringify({ error: "Google Places API key invalid or missing" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const places = (placesData.results ?? []).slice(0, 20);

    const restaurants = await Promise.all(
      places.map(async (place: any) => {
        // Fetch place details for hours
        const detailUrl =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${place.place_id}&fields=opening_hours,website&key=${PLACES_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        const details = detailData.result ?? {};

        // Map hours
        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const hours: Record<string, string> = {};
        dayNames.forEach((d) => (hours[d] = "Hours unavailable"));

        if (details.opening_hours?.periods) {
          details.opening_hours.periods.forEach((period: any) => {
            const day = dayNames[period.open?.day ?? 0];
            if (period.close) {
              hours[day] = `${fmtTime(period.open.time)} - ${fmtTime(period.close.time)}`;
            } else {
              hours[day] = "Open 24 hours";
            }
          });
        }

        const photoRef = place.photos?.[0]?.photo_reference;
        const thumbnailUrl = photoRef
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${PLACES_KEY}`
          : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

        const cuisine = typeToLabel[type] ?? "Restaurant";
        const distance = calcDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);

        const row = {
          id: place.place_id,
          name: place.name,
          description: place.vicinity ?? "",
          address: place.vicinity ?? "",
          city: "",
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          rating: place.rating ?? 0,
          cuisine,
          category: category === "all" ? "american" : category,
          tags: [cuisine],
          thumbnail_url: thumbnailUrl,
          hours,
          ordering_services: details.website ? { website: details.website } : null,
        };

        await supabase.from("restaurants").upsert(row, { onConflict: "id" });

        // Return client-friendly shape
        return {
          ...row,
          thumbnailUrl,
          orderingServices: row.ordering_services,
          distance,
          videoUrl: "",
        };
      })
    );

    return new Response(JSON.stringify(restaurants), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function fmtTime(t: string): string {
  const h = parseInt(t.slice(0, 2));
  const m = t.slice(2);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m} ${ampm}`;
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(Math.sqrt(a) * R * 2 * 100) / 100;
}
