import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function CustomerPortal() {
  const [traveler, setTraveler] = useState(null);

  useEffect(() => {
    async function fetchTraveler() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("travelers")
        .select("*")
        .eq("email", user.email)
        .single();

      setTraveler(data);
    }

    fetchTraveler();
  }, []);

  if (!traveler) return <p>Loading your trip details...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome {traveler.first_name}</h2>
      <p>Trip Dates: {traveler.trip_start_date} -> {traveler.trip_end_date}</p>
      <p>Emergency Contact: {traveler.emergency_contact_name}</p>
      <p>Itinerary: {traveler.itinerary}</p>
    </div>
  );
}
