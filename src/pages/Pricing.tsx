import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Pricing has been merged into the booking menu so we have one source of truth.
 * Anyone landing here is forwarded to /bookings, which is the same layout
 * with the live calendar embed underneath.
 */
export default function Pricing() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/bookings", { replace: true });
  }, [navigate]);
  return null;
}
