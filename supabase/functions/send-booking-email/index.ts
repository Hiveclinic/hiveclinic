import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[BOOKING-EMAIL] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const ADMIN_EMAIL = "hello@hiveclinicuk.com";
const LOGO_URL = "https://kyjzjgdcfisuxogledux.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

async function sendEmail(to: string | string[], subject: string, html: string, from?: string) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ to: Array.isArray(to) ? to : [to], subject, html, ...(from ? { from } : {}) }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`send-email failed: ${data.error || res.statusText}`);
  }
  return data;
}

const headerHtml = `
  <div style="padding:40px 30px 20px;text-align:center;background:#ffffff;">
    <img src="${LOGO_URL}" alt="Hive Clinic" width="120" style="display:block;margin:0 auto 20px;" />
    <div style="width:60px;height:1px;background:#c9a96e;margin:0 auto;"></div>
  </div>
`;

const footerHtml = `
  <div style="padding:30px;text-align:center;border-top:1px solid #e8e0d8;background:#ffffff;">
    <p style="font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;font-size:11px;color:#999;margin:0;letter-spacing:0.1em;text-transform:uppercase;">
      <a href="https://hiveclinicuk.com" style="color:#c9a96e;text-decoration:none;">Hive Clinic</a> · Aesthetics & Skin
    </p>
    <p style="font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;font-size:11px;color:#bbb;margin:8px 0 0;">
      Deansgate, Manchester City Centre
    </p>
    <p style="font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;font-size:11px;color:#bbb;margin:8px 0 0;">
      <a href="https://wa.me/447795008114" style="color:#c9a96e;text-decoration:none;">WhatsApp</a>
      &nbsp;&middot;&nbsp;
      <a href="https://instagram.com/hiveclinicuk" style="color:#c9a96e;text-decoration:none;">Instagram</a>
      &nbsp;&middot;&nbsp;
      <a href="https://hiveclinicuk.com" style="color:#c9a96e;text-decoration:none;">Website</a>
    </p>
  </div>
`;

function wrap(body: string): string {
  return `
    <div style="font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;">
      ${headerHtml}
      <div style="padding:30px 30px 40px;">
        ${body}
      </div>
      ${footerHtml}
    </div>
  `;
}

const h2Style = "font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:500;color:#0d0d0d;margin:0 0 20px;text-align:center;";
const pStyle = "font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;color:#555;font-size:14px;line-height:1.6;letter-spacing:0.01em;";
const cardStyle = "background:#f9f7f5;border-left:3px solid #c9a96e;padding:20px;margin:24px 0;";
const btnStyle = "display:inline-block;background:#0d0d0d;color:#ffffff;padding:14px 32px;font-family:'Satoshi','Helvetica Neue',Arial,sans-serif;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, emailType, oldDate, oldTime } = await req.json();

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
    const firstName = booking.customer_name.split(" ")[0];

    let subject = "";
    let html = "";

    // ====== ADMIN NEW BOOKING NOTIFICATION ======
    if (emailType === "admin_new_booking") {
      subject = `✨ New Booking! ${booking.customer_name} — ${treatmentName}`;
      html = wrap(`
        <h2 style="${h2Style}">🎉 New Booking Received!</h2>
        <p style="${pStyle}"><strong>${booking.customer_name}</strong> has booked <strong>${treatmentName}</strong>.</p>
        <div style="${cardStyle}">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Client:</strong> ${booking.customer_name}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${booking.customer_email}</p>
          ${booking.customer_phone ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Phone:</strong> ${booking.customer_phone}</p>` : ""}
          <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Duration:</strong> ${booking.duration_mins} minutes</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>
          ${Number(booking.deposit_amount) > 0 ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Booking Fee Paid:</strong> £${Number(booking.deposit_amount).toFixed(2)}</p>` : ""}
          <p style="margin:0;font-size:14px;"><strong>Payment Status:</strong> ${booking.payment_status}</p>
        </div>
        ${booking.notes ? `<p style="${pStyle}"><strong>Client Notes:</strong> ${booking.notes}</p>` : ""}
      `);

      logStep("Sending admin notification", { to: ADMIN_EMAIL });
      await sendEmail(ADMIN_EMAIL, subject, html);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    if (emailType === "confirmation") {
      subject = `✅ Booking Confirmed — ${treatmentName}`;
      html = wrap(`
        <h2 style="${h2Style}">You're all booked in! 🙌</h2>
        <p style="${pStyle}">Hi ${firstName},</p>
        <p style="${pStyle}">Thank you for booking with Hive Clinic — we can't wait to see you! Here are your appointment details:</p>
        <div style="${cardStyle}">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
          <p style="margin:0;font-size:14px;"><strong>Duration:</strong> ${booking.duration_mins} minutes</p>
          ${Number(booking.total_price) > 0 ? `<p style="margin:8px 0 0;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>` : ""}
        </div>
        <p style="${pStyle}">Please arrive 5 minutes early. If you need to reschedule, contact us at least 48 hours in advance.</p>
        <p style="${pStyle}">See you soon! 💛</p>
      `);
    } else if (emailType === "reminder") {
      subject = `⏰ Reminder — ${treatmentName} Tomorrow!`;
      html = wrap(`
        <h2 style="${h2Style}">See you tomorrow! 👋</h2>
        <p style="${pStyle}">Hi ${firstName},</p>
        <p style="${pStyle}">Just a friendly reminder that your appointment is tomorrow — we're looking forward to it!</p>
        <div style="${cardStyle}">
          <p style="margin:0 0 8px;font-size:14px;"><strong>${treatmentName}</strong></p>
          <p style="margin:0 0 8px;font-size:14px;">${dateFormatted}</p>
          <p style="margin:0;font-size:14px;">${timeFormatted}</p>
        </div>
        <p style="${pStyle}"><strong>Preparation tips:</strong></p>
        <ul style="${pStyle}line-height:1.8;">
          <li>Arrive 5 minutes early</li>
          <li>Come with a clean face (no makeup for skin treatments)</li>
          <li>Avoid alcohol 24 hours before injectable treatments</li>
          <li>Stay hydrated</li>
        </ul>
        <p style="${pStyle}">Need to reschedule? Please let us know ASAP via <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a>.</p>
      `);
    } else if (emailType === "aftercare") {
      subject = `💆 Your Aftercare Guide — ${treatmentName}`;
      html = wrap(`
        <h2 style="${h2Style}">Thanks for visiting! ✨</h2>
        <p style="${pStyle}">Hi ${firstName},</p>
        <p style="${pStyle}">It was lovely seeing you today! Here are your aftercare instructions for <strong>${treatmentName}</strong> to keep those results looking incredible:</p>
        <div style="${cardStyle}">
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
        <p style="${pStyle}">For personalised aftercare advice, visit our <a href="https://hiveclinicuk.com/aftercare" style="color:#c9a96e;">aftercare page</a> or chat with our AI aftercare assistant.</p>
        <p style="${pStyle}">If you experience any concerns, please contact us immediately via <a href="https://wa.me/447795008114" style="color:#c9a96e;">WhatsApp</a>.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="https://hiveclinicuk.com/bookings" style="${btnStyle}">Book Your Next Treatment</a>
        </div>
      `);

      await supabaseClient.from("bookings").update({ aftercare_sent: true }).eq("id", bookingId);
    } else if (emailType === "cancellation") {
      subject = `❌ Booking Cancelled — ${treatmentName}`;
      html = wrap(`
        <h2 style="${h2Style}">Booking Cancelled</h2>
        <p style="${pStyle}">Hi ${firstName},</p>
        <p style="${pStyle}">Your appointment for <strong>${treatmentName}</strong> on <strong>${dateFormatted}</strong> at <strong>${timeFormatted}</strong> has been cancelled.</p>
        <p style="${pStyle}">We're sorry to see this one go — but we'd love to see you again soon! 💛</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="https://hiveclinicuk.com/bookings" style="${btnStyle}">Rebook Now</a>
        </div>
      `);

      // Also notify admin
      const adminCancelHtml = wrap(`
        <h2 style="${h2Style}">😔 Booking Cancelled</h2>
        <p style="${pStyle}"><strong>${booking.customer_name}</strong> has cancelled their <strong>${treatmentName}</strong> appointment.</p>
        <div style="${cardStyle}">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
          <p style="margin:0;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>
        </div>
        <p style="${pStyle}">Email: ${booking.customer_email}</p>
        ${booking.customer_phone ? `<p style="${pStyle}">Phone: ${booking.customer_phone}</p>` : ""}
      `);
      await sendEmail(ADMIN_EMAIL, `😔 Cancelled: ${booking.customer_name} — ${treatmentName}`, adminCancelHtml);
    } else if (emailType === "reschedule") {
      subject = `📅 Appointment Rescheduled — ${treatmentName}`;
      html = wrap(`
        <h2 style="${h2Style}">You're rescheduled! 🔄</h2>
        <p style="${pStyle}">Hi ${firstName},</p>
        <p style="${pStyle}">Your appointment has been successfully rescheduled. Here are your new details:</p>
        <div style="${cardStyle}">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>New Date:</strong> ${dateFormatted}</p>
          <p style="margin:0;font-size:14px;"><strong>New Time:</strong> ${timeFormatted}</p>
        </div>
        <p style="${pStyle}">We look forward to seeing you! 💛</p>
      `);

      logStep("Sending reschedule email to customer", { to: booking.customer_email });
      await sendEmail(booking.customer_email, subject, html);

      const oldDateFormatted = oldDate ? new Date(oldDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Unknown";
      const oldTimeFormatted = oldTime ? oldTime.slice(0, 5) : "Unknown";
      
      const adminHtml = wrap(`
        <h2 style="${h2Style}">🔄 Client Rescheduled</h2>
        <p style="${pStyle}"><strong>${booking.customer_name}</strong> has rescheduled their <strong>${treatmentName}</strong> appointment.</p>
        <div style="background:#fff3f3;border-left:3px solid #e55;padding:15px;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#555;"><strong>Previous:</strong> ${oldDateFormatted} at ${oldTimeFormatted}</p>
        </div>
        <div style="background:#f0fff0;border-left:3px solid #5a5;padding:15px;margin:0 0 16px;">
          <p style="margin:0;font-size:13px;color:#555;"><strong>New:</strong> ${dateFormatted} at ${timeFormatted}</p>
        </div>
        <p style="${pStyle}">Email: ${booking.customer_email}</p>
        ${booking.customer_phone ? `<p style="${pStyle}">Phone: ${booking.customer_phone}</p>` : ""}
      `);

      logStep("Sending reschedule notification to admin");
      await sendEmail(ADMIN_EMAIL, `🔄 Rescheduled: ${booking.customer_name} — ${treatmentName}`, adminHtml);

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    } else if (emailType === "client_cancelled") {
      const adminCancelHtml = wrap(`
        <h2 style="${h2Style}">😔 Client Cancelled</h2>
        <p style="${pStyle}"><strong>${booking.customer_name}</strong> has cancelled their <strong>${treatmentName}</strong> appointment.</p>
        <div style="background:#fff3f3;border-left:3px solid #e55;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Treatment:</strong> ${treatmentName}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Date:</strong> ${dateFormatted}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Time:</strong> ${timeFormatted}</p>
          <p style="margin:0;font-size:14px;"><strong>Total:</strong> £${Number(booking.total_price).toFixed(2)}</p>
        </div>
        <p style="${pStyle}">Email: ${booking.customer_email}</p>
        ${booking.customer_phone ? `<p style="${pStyle}">Phone: ${booking.customer_phone}</p>` : ""}
      `);

      logStep("Sending client cancellation notification to admin");
      await sendEmail(ADMIN_EMAIL, `😔 Cancelled: ${booking.customer_name} — ${treatmentName}`, adminCancelHtml);

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    } else {
      throw new Error(`Unknown email type: ${emailType}`);
    }

    // Send client email
    logStep("Sending email", { to: booking.customer_email, subject });
    await sendEmail(booking.customer_email, subject, html);

    // Send admin a copy for every standard type
    logStep("Sending admin copy", { subject });
    await sendEmail(ADMIN_EMAIL, `${subject}`, html);

    logStep("Email sent successfully");

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
