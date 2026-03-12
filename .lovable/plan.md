

# Targeted Functional Fixes — No Redesign

## 1. Consent Forms (`AdminConsultationsTab.tsx`)

**Schema migration:**
- Add `document_url text` to `consent_form_templates`
- Create `consent-documents` storage bucket (private)
- Add RLS: admin ALL, authenticated SELECT on `consent-documents` objects

**Template editing:** Add Edit button on each template card. Clicking opens inline editor with: name input, form_type dropdown, treatment_id dropdown, field rows editor (add/remove rows with label text, type dropdown [text/textarea/checkbox/signature], required toggle). Save updates to DB.

**PDF upload on templates:** Add file upload button per template. Uploads to `consent-documents` bucket, stores URL in `document_url`. Show link to download if present.

**New Submission flow:** Add "New Submission" button in submissions tab. Modal/inline form that:
- Fetches `customer_profiles` for a searchable client dropdown
- Fallback to manual name + email entry
- Select a template
- Creates `consent_submissions` row with status `pending`, `form_data` pre-populated from template fields as empty key-value pairs

**Expand submission:** Click a submission to toggle expanded view showing all `form_data` entries in readable format + signature image if present. Already partially done via print — add inline expansion.

**Keep:** Existing signature pad, print/PDF, sign-off all work and stay connected.

## 2. Media Management (`AdminSiteTab.tsx`)

**Changes:**
- Add `IMAGE_SLOTS` constant:
  ```
  hero_home → "Homepage Hero" / "Large banner at top of homepage"
  gallery_1-6 → "Gallery Image 1-6" / "Homepage gallery section"
  about_hero → "About Page Hero" / "Banner on the About page"
  ```
- Replace `img.key.replace(/_/g, " ")` with friendly label lookup
- Add subtitle showing where image appears
- Remove `addNewImageKey` function and its "Add Image Slot" button
- Remove delete button for keys that exist in `IMAGE_SLOTS` (only show for unknown/custom keys)
- All upload/replace/drag-drop logic stays unchanged

## 3. Reviews (`AdminReviewsTab.tsx`)

**Text changes only — no logic changes:**
- Button: "Add Review" → "Import Review"
- Form heading: "New Review" → "Import Google Review"
- Description: → "Import reviews from your Google Business profile. Paste the reviewer name and review text."
- Remove `<option value="manual">Manual</option>` from source dropdown (keep google only in import form)
- Placeholder: → "Paste the Google review text here..."
- Empty state: → "No reviews imported yet. Import your first Google review above."
- Submit button: "Add Review" → "Import Review"
- All CRUD logic unchanged

## 4. Marketing (`AdminMarketingTab.tsx`)

- Delete lines 112-140 (entire "Automated Actions" section with Coming Soon cards)
- Add after segments: Email Integration status card showing "Resend — Configured" (Resend API key is present in secrets) with note "Delivery not yet tested — send a test campaign to verify"
- Keep segments, campaign CRUD, campaign list unchanged

## 5. Dead Controls Audit

**`AdminSettingsTab.tsx`:**
- Integrations list shows hardcoded "Connected"/"Setup" statuses. Google Calendar shows "Setup" but clicking does nothing. Change all statuses to read-only informational: remove any implication of clickable setup. Change "Setup" to "Not configured". Change "Connected" to "Configured" since we can't verify live connection status. These are display-only — no action needed.
- Settings save to localStorage — functional, not dead. Leave as-is.

**`AdminDashboardHome.tsx`:**
- Quick actions (New Booking, Add Client, Upload Photo, Create Discount) all call `onNavigate` which switches tabs — functional. No dead controls.

**`AdminSiteTab.tsx`:**
- `addNewImageKey` with `prompt()` — removed in section 2.

**`AdminConsultationsTab.tsx`:**
- No dead controls found beyond missing edit functionality, addressed in section 1.

**`AdminReviewsTab.tsx`:**
- All buttons functional. Language changes only in section 3.

**`AdminMarketingTab.tsx`:**
- Fake automation cards — removed in section 4.

## Database Migration

```sql
ALTER TABLE public.consent_form_templates 
  ADD COLUMN IF NOT EXISTS document_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('consent-documents', 'consent-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can manage consent docs"
ON storage.objects FOR ALL
USING (bucket_id = 'consent-documents' AND (SELECT public.has_role(auth.uid(), 'admin')))
WITH CHECK (bucket_id = 'consent-documents' AND (SELECT public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Authenticated can read consent docs"
ON storage.objects FOR SELECT
USING (bucket_id = 'consent-documents' AND auth.role() = 'authenticated');
```

## Files Modified

| File | Scope |
|------|-------|
| `AdminConsultationsTab.tsx` | Template edit, new submission with client picker, inline viewer, PDF upload |
| `AdminSiteTab.tsx` | IMAGE_SLOTS labels, remove addNewImageKey, conditional delete button |
| `AdminReviewsTab.tsx` | Label/copy changes only |
| `AdminMarketingTab.tsx` | Remove fake automations, add email status card |
| `AdminSettingsTab.tsx` | Change "Connected"→"Configured", "Setup"→"Not configured" |

No new files. No UI redesign. Minimal changes per file.

