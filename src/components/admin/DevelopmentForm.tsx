import { saveDevelopment } from "@/app/admin/actions";
import type { AdminDevelopment } from "@/lib/db/admin";
import { AdminForm, Field, inputClass, textareaClass } from "./AdminForm";

/** Create/edit form for a development. Server-rendered; submits to saveDevelopment. */
export function DevelopmentForm({ dev }: { dev?: AdminDevelopment }) {
  return (
    <AdminForm action={saveDevelopment} submitLabel={dev ? "Save changes" : "Create development"}>
      {dev && <input type="hidden" name="id" value={dev.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name">
          <input id="name" name="name" defaultValue={dev?.name} required className={inputClass} />
        </Field>
        <Field label="URL slug" name="slug" hint="Lowercase with hyphens, e.g. ivy-homes-abijo. Changing it changes the page address.">
          <input id="slug" name="slug" defaultValue={dev?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputClass} />
        </Field>
        <Field label="Area" name="area">
          <input id="area" name="area" defaultValue={dev?.area} required className={inputClass} />
        </Field>
        <Field label="City" name="city">
          <input id="city" name="city" defaultValue={dev?.city} required className={inputClass} />
        </Field>
        <Field label="State" name="state">
          <input id="state" name="state" defaultValue={dev?.state} required className={inputClass} />
        </Field>
        <Field label="Status" name="status">
          <select id="status" name="status" defaultValue={dev?.status ?? "for_sale"} className={inputClass}>
            <option value="for_sale">For sale</option>
            <option value="coming_soon">Coming soon</option>
            <option value="sold_out">Sold out</option>
          </select>
        </Field>
        <Field label="Property type" name="property_type" hint="e.g. Apartments, Semi-detached duplexes">
          <input id="property_type" name="property_type" defaultValue={dev?.property_type} required className={inputClass} />
        </Field>
        <Field label="Bedrooms" name="bedrooms" hint="Comma-separated, e.g. 3, 4">
          <input id="bedrooms" name="bedrooms" defaultValue={dev?.bedrooms.join(", ")} className={inputClass} />
        </Field>
        <Field label="Starting price (₦)" name="price_from_ngn">
          <input id="price_from_ngn" name="price_from_ngn" type="number" min={0} step={1000} defaultValue={dev ? Number(dev.price_from_ngn) : undefined} required className={inputClass} />
        </Field>
        <Field label="Display order" name="sort_order">
          <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={dev?.sort_order ?? 0} className={inputClass} />
        </Field>
        <Field label="Bathrooms" name="baths" hint="Leave blank to show “On request”">
          <input id="baths" name="baths" defaultValue={dev?.baths ?? ""} className={inputClass} />
        </Field>
        <Field label="Floor area" name="sqm" hint="e.g. 180–240 m²">
          <input id="sqm" name="sqm" defaultValue={dev?.sqm ?? ""} className={inputClass} />
        </Field>
        <Field label="Title" name="title_type" hint="e.g. Certificate of Occupancy">
          <input id="title_type" name="title_type" defaultValue={dev?.title_type ?? ""} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" name="lat">
            <input id="lat" name="lat" type="number" step="any" defaultValue={dev?.lat ?? ""} className={inputClass} />
          </Field>
          <Field label="Longitude" name="lng">
            <input id="lng" name="lng" type="number" step="any" defaultValue={dev?.lng ?? ""} className={inputClass} />
          </Field>
        </div>
      </div>
      <Field label="Summary" name="summary" hint="One sentence for cards and search results.">
        <input id="summary" name="summary" defaultValue={dev?.summary} required className={inputClass} />
      </Field>
      <Field label="Headline" name="headline" hint="The opening statement on the development page.">
        <textarea id="headline" name="headline" defaultValue={dev?.headline ?? ""} className={textareaClass} />
      </Field>
      <Field label="Description" name="description" hint="One paragraph per line.">
        <textarea id="description" name="description" defaultValue={dev?.description.join("\n")} className={`${textareaClass} min-h-40`} />
      </Field>
      <Field label="Amenities" name="amenities" hint="One per line.">
        <textarea id="amenities" name="amenities" defaultValue={dev?.amenities.join("\n")} className={`${textareaClass} min-h-32`} />
      </Field>
      <fieldset className="flex flex-wrap gap-6 text-sm">
        <legend className="sr-only">Visibility</legend>
        {[
          { name: "published", label: "Published on the website", checked: dev?.published ?? false },
          { name: "featured", label: "Featured on the home page", checked: dev?.featured ?? false },
          { name: "location_approximate", label: "Map pin is approximate", checked: dev?.location_approximate ?? true },
        ].map((c) => (
          <label key={c.name} className="flex items-center gap-2">
            <input type="checkbox" name={c.name} defaultChecked={c.checked} className="accent-oxblood size-4" />
            {c.label}
          </label>
        ))}
      </fieldset>
    </AdminForm>
  );
}
