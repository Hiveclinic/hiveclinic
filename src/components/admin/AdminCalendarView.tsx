import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";

type CalendarBooking = {
  id: string;
  customer_name: string;
  booking_date: string;
  booking_time: string;
  duration_mins: number;
  status: string;
  treatments?: { name: string } | null;
};

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

const STATUS_BG: Record<string, string> = {
  confirmed: "bg-blue-500/20 border-blue-500/40 text-blue-700",
  completed: "bg-green-500/20 border-green-500/40 text-green-700",
  cancelled: "bg-red-500/20 border-red-500/40 text-red-400 line-through opacity-50",
  no_show: "bg-orange-500/20 border-orange-500/40 text-orange-600",
  pending: "bg-yellow-500/20 border-yellow-500/40 text-yellow-700",
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8am-9pm

const AdminCalendarView = () => {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [dragBooking, setDragBooking] = useState<CalendarBooking | null>(null);
  const [loading, setLoading] = useState(true);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const fetchData = async () => {
    setLoading(true);
    const startStr = format(weekDays[0], "yyyy-MM-dd");
    const endStr = format(weekDays[6], "yyyy-MM-dd");

    const [bookRes, availRes] = await Promise.all([
      supabase.from("bookings").select("id, customer_name, booking_date, booking_time, duration_mins, status, treatments(name)")
        .gte("booking_date", startStr).lte("booking_date", endStr).neq("status", "cancelled"),
      supabase.from("availability").select("*"),
    ]);

    if (bookRes.data) setBookings(bookRes.data as unknown as CalendarBooking[]);
    if (availRes.data) setAvailability(availRes.data as Availability[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [weekStart]);

  const handleDrop = async (date: Date, hour: number) => {
    if (!dragBooking) return;

    const newDate = format(date, "yyyy-MM-dd");
    const newTime = `${String(hour).padStart(2, "0")}:00`;

    // Check if the slot is available
    const dayAvail = availability.find(a => a.day_of_week === date.getDay());
    if (!dayAvail?.is_available) {
      toast.error("That day is unavailable");
      setDragBooking(null);
      return;
    }

    const { error } = await supabase.from("bookings")
      .update({ booking_date: newDate, booking_time: newTime })
      .eq("id", dragBooking.id);

    if (error) {
      toast.error("Failed to reschedule");
    } else {
      toast.success(`${dragBooking.customer_name} moved to ${format(date, "EEE d MMM")} at ${newTime}`);
      fetchData();
    }
    setDragBooking(null);
  };

  const getBookingsForSlot = (date: Date, hour: number) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings.filter(b => {
      if (b.booking_date !== dateStr) return false;
      const bookingHour = parseInt(b.booking_time.split(":")[0]);
      return bookingHour === hour;
    });
  };

  const isDayAvailable = (date: Date) => {
    const avail = availability.find(a => a.day_of_week === date.getDay());
    return avail?.is_available ?? false;
  };

  return (
    <div>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 border border-border hover:border-gold transition-colors">
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-display text-xl">
          {format(weekDays[0], "d MMM")} — {format(weekDays[6], "d MMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-gold transition-colors">Today</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 border border-border hover:border-gold transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading calendar...</p></div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-2 font-body text-xs text-muted-foreground">Time</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className={`p-2 text-center ${isSameDay(day, new Date()) ? "bg-gold/10" : ""} ${!isDayAvailable(day) ? "opacity-40" : ""}`}>
                  <p className="font-body text-xs text-muted-foreground">{format(day, "EEE")}</p>
                  <p className={`font-display text-lg ${isSameDay(day, new Date()) ? "text-gold" : ""}`}>{format(day, "d")}</p>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[60px]">
                <div className="p-2 font-body text-xs text-muted-foreground flex items-start">
                  {`${String(hour).padStart(2, "0")}:00`}
                </div>
                {weekDays.map(day => {
                  const slotBookings = getBookingsForSlot(day, hour);
                  const available = isDayAvailable(day);

                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={`p-1 border-l border-border/30 ${available ? "cursor-pointer hover:bg-gold/5" : "bg-secondary/30"} ${isSameDay(day, new Date()) ? "bg-gold/5" : ""}`}
                      onDragOver={e => { if (available) e.preventDefault(); }}
                      onDrop={() => handleDrop(day, hour)}
                    >
                      {slotBookings.map(b => (
                        <div
                          key={b.id}
                          draggable
                          onDragStart={() => setDragBooking(b)}
                          onDragEnd={() => setDragBooking(null)}
                          className={`px-2 py-1 mb-1 border rounded text-xs cursor-grab active:cursor-grabbing ${STATUS_BG[b.status] || "bg-secondary"}`}
                        >
                          <p className="font-body font-medium truncate">{b.customer_name}</p>
                          <p className="font-body text-[10px] opacity-70 truncate">
                            {(b.treatments as any)?.name} · {b.duration_mins}m
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="font-body text-xs text-muted-foreground mt-4 text-center">
        Drag and drop bookings to reschedule. Only available slots are shown.
      </p>
    </div>
  );
};

export default AdminCalendarView;
