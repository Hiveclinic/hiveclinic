import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[BOOKING-EMAIL] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const ADMIN_EMAIL = "hello@hiveclinicuk.com";
const FROM_EMAIL = "Hive Clinic <noreply@notify.hiveclinicuk.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");

    const resend = new Resend(resendKey);

    const { bookingId, emailType, oldDate, oldTime } = await req.json();
    // emailType: "confirmation" | "reminder" | "aftercare" | "cancellation" | "reschedule" | "client_cancelled" | "admin_new_booking"

    if (!bookingId || !emailType) throw new Error("Missing bookingId or emailType");
    logStep("Processing email", { bookingId, emailType });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*, treatments(name, description)")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) throw new Error("Booking not found");
    logStep("Booking found", { name: booking.customer_name, treatment: booking.treatments?.name });

    const treatmentName = booking.treatments?.name || "your treatment";
    const dateFormatted = new Date(booking.booking_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const timeFormatted = booking.booking_time?.slice(0, 5);

    let subject = "";
    let html = "";

    const headerHtml = `
      <div style="background:#0d0d0d;padding:40px 30px;text-align:center;">
        <h1 style="font-family:Georgia,serif;color:#c9a96e;font-size:28px;margin:0;">Hive Clinic</h1>
        <p style="color:#999;font-size:12px;margin-top:4px;letter-spacing:2px;">MANCHESTER</p>
      </div>
    `;

    const footerHtml = `
      <div style="background:#f5f0eb;padding:30px;text-align:center;border-top:1px solid #e5ddd5;">
        <p style="font-size:12px;color:#999;margin:0;">Hive Clinic - Manchester City Centre, Deansgate</p>
        <p style="font-size:11px;color:#bbb;margin-top:8px;">
          <a href="https://hiveclinicuk.com" style="color:#c9a96e;">Website</a> - 
          <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a> - 
          <a href="https://instagram.com/hiveclinicuk" style="color:#c9a96e;">Instagram</a>
        </p>
      </div>
    `;

    // ====== ADMIN NEW BOOKING NOTIFICATION ======
    if (emailType === "admin_new_booking") {
      subject = `New Booking: ${booking.customer_name} - ${treatmentName}`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">New Booking Received</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">A new booking has been confirmed:</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;"><strong>Client:</strong> ${booking.customer_name}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${booking.customer_email}</p>
              ${booking.customer_phone ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Phone:</strong> ${booking.customer_phone}</p>` : ""}
              <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Duration:</strong> ${booking.duration_mins} minutes</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>
              ${Number(booking.deposit_amount) > 0 ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Deposit Paid:</strong> £${Number(booking.deposit_amount).toFixed(2)}</p>` : ""}
              <p style="margin:0;font-size:14px;"><strong>Payment Status:</strong> ${booking.payment_status}</p>
            </div>

            ${booking.notes ? `<p style="color:#555;font-size:14px;line-height:1.6;"><strong>Client Notes:</strong> ${booking.notes}</p>` : ""}
          </div>
          ${footerHtml}
        </div>
      `;

      logStep("Sending admin notification", { to: ADMIN_EMAIL });
      await resend.emails.send({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject, html });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    if (emailType === "confirmation") {
      subject = `Booking Confirmed - ${treatmentName}`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Your booking is confirmed</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">Hi ${booking.customer_name},</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Thank you for booking with Hive Clinic. Here are your appointment details:</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
              <p style="margin:0;font-size:14px;"><strong>Duration:</strong> ${booking.duration_mins} minutes</p>
              ${Number(booking.total_price) > 0 ? `<p style="margin:8px 0 0;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>` : ""}
            </div>
            
            <p style="color:#555;font-size:14px;line-height:1.6;">Please arrive 5 minutes early. If you need to reschedule, contact us at least 48 hours in advance.</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">We look forward to seeing you!</p>
          </div>
          ${footerHtml}
        </div>
      `;
    } else if (emailType === "reminder") {
      subject = `Reminder: ${treatmentName} Tomorrow`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Your appointment is tomorrow</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">Hi ${booking.customer_name},</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Just a friendly reminder that your appointment is tomorrow:</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;"><strong>${treatmentName}</strong></p>
              <p style="margin:0 0 8px;font-size:14px;">${dateFormatted}</p>
              <p style="margin:0;font-size:14px;">${timeFormatted}</p>
            </div>
            
            <p style="color:#555;font-size:14px;line-height:1.6;"><strong>Preparation tips:</strong></p>
            <ul style="color:#555;font-size:14px;line-height:1.8;">
              <li>Arrive 5 minutes early</li>
              <li>Come with a clean face (no makeup for skin treatments)</li>
              <li>Avoid alcohol 24 hours before injectable treatments</li>
              <li>Stay hydrated</li>
            </ul>
            
            <p style="color:#555;font-size:14px;line-height:1.6;">Need to reschedule? Please let us know ASAP via <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a>.</p>
          </div>
          ${footerHtml}
        </div>
      `;
    } else if (emailType === "aftercare") {
      subject = `Aftercare Instructions - ${treatmentName}`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Your aftercare guide</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">Hi ${booking.customer_name},</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Thank you for visiting Hive Clinic today. Here are your aftercare instructions for ${treatmentName}:</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0 0 12px;font-size:14px;font-weight:bold;">General Aftercare</p>
              <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#555;">
                <li>Avoid touching the treated area for at least 4 hours</li>
                <li>No strenuous exercise for 24 hours</li>
                <li>Avoid extreme heat (saunas, hot baths) for 48 hours</li>
                <li>Stay hydrated and avoid alcohol for 24 hours</li>
                <li>Use SPF 50+ on treated areas when outdoors</li>
                <li>Apply any prescribed aftercare products as directed</li>
              </ul>
            </div>
            
            <p style="color:#555;font-size:14px;line-height:1.6;">For personalised aftercare advice, visit our <a href="https://hiveclinicuk.com/aftercare" style="color:#c9a96e;">aftercare page</a> or chat with our AI aftercare assistant.</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">If you experience any concerns, please contact us immediately via <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a>.</p>
            
            <div style="text-align:center;margin:30px 0;">
              <a href="https://hiveclinicuk.com/bookings" style="display:inline-block;background:#0d0d0d;color:#fff;padding:14px 32px;font-size:13px;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">Book Your Next Treatment</a>
            </div>
          </div>
          ${footerHtml}
        </div>
      `;

      await supabaseClient.from("bookings").update({ aftercare_sent: true }).eq("id", bookingId);
    } else if (emailType === "cancellation") {
      subject = `Booking Cancelled - ${treatmentName}`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Booking Cancelled</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">Hi ${booking.customer_name},</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Your appointment for <strong>${treatmentName}</strong> on <strong>${dateFormatted}</strong> at <strong>${timeFormatted}</strong> has been cancelled.</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0;font-size:14px;color:#555;">If you'd like to rebook, please contact us via <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a> or visit our <a href="https://hiveclinicuk.com/bookings" style="color:#c9a96e;">booking page</a>.</p>
            </div>
            
            <div style="text-align:center;margin:30px 0;">
              <a href="https://hiveclinicuk.com/bookings" style="display:inline-block;background:#0d0d0d;color:#fff;padding:14px 32px;font-size:13px;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">Rebook Now</a>
            </div>
          </div>
          ${footerHtml}
        </div>
      `;
    } else if (emailType === "reschedule") {
      subject = `Appointment Rescheduled - ${treatmentName}`;
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Appointment Rescheduled</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">Hi ${booking.customer_name},</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Your appointment has been successfully rescheduled. Here are your new details:</p>
            
            <div style="background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>New Date:</strong> ${dateFormatted}</p>
              <p style="margin:0;font-size:14px;"><strong>New Time:</strong> ${timeFormatted}</p>
            </div>
            
            <p style="color:#555;font-size:14px;line-height:1.6;">We look forward to seeing you!</p>
          </div>
          ${footerHtml}
        </div>
      `;

      // Send customer email
      logStep("Sending reschedule email to customer", { to: booking.customer_email });
      await resend.emails.send({ from: FROM_EMAIL, to: [booking.customer_email], subject, html });

      // Send admin notification
      const oldDateFormatted = oldDate ? new Date(oldDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Unknown";
      const oldTimeFormatted = oldTime ? oldTime.slice(0, 5) : "Unknown";
      
      const adminHtml = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Client Rescheduled</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;"><strong>${booking.customer_name}</strong> has rescheduled their appointment:</p>
            
            <div style="background:#fff3f3;border-left:3px solid #e55;padding:15px;margin:16px 0;">
              <p style="margin:0;font-size:13px;color:#555;"><strong>Previous:</strong> ${oldDateFormatted} at ${oldTimeFormatted}</p>
            </div>
            <div style="background:#f0fff0;border-left:3px solid #5a5;padding:15px;margin:0 0 16px;">
              <p style="margin:0;font-size:13px;color:#555;"><strong>New:</strong> ${dateFormatted} at ${timeFormatted}</p>
            </div>
            
            <p style="color:#555;font-size:14px;line-height:1.6;">Treatment: ${treatmentName}</p>
            <p style="color:#555;font-size:14px;line-height:1.6;">Email: ${booking.customer_email}</p>
            ${booking.customer_phone ? `<p style="color:#555;font-size:14px;line-height:1.6;">Phone: ${booking.customer_phone}</p>` : ""}
          </div>
          ${footerHtml}
        </div>
      `;

      logStep("Sending reschedule notification to admin");
      await resend.emails.send({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject: `Reschedule: ${booking.customer_name} - ${treatmentName}`, html: adminHtml });

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    } else if (emailType === "client_cancelled") {
      const adminCancelHtml = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          ${headerHtml}
          <div style="padding:40px 30px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;color:#0d0d0d;margin:0 0 20px;">Client Cancelled Booking</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;"><strong>${booking.customer_name}</strong> has cancelled their appointment:</p>
            <div style="background:#fff3f3;border-left:3px solid #e55;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
              <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
              <p style="margin:0;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>
            </div>
            <p style="color:#555;font-size:14px;">Email: ${booking.customer_email}</p>
            ${booking.customer_phone ? `<p style="color:#555;font-size:14px;">Phone: ${booking.customer_phone}</p>` : ""}
          </div>
          ${footerHtml}
        </div>
      `;

      logStep("Sending client cancellation notification to admin");
      await resend.emails.send({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject: `Client Cancelled: ${booking.customer_name} - ${treatmentName}`, html: adminCancelHtml });

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    } else {
      throw new Error(`Unknown email type: ${emailType}`);
    }

    logStep("Sending email", { to: booking.customer_email, subject });

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [booking.customer_email],
      subject,
      html,
    });

    logStep("Email sent successfully", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
