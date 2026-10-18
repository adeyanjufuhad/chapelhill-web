import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ProjectGallery, type GalleryProject } from "@/components/developments/ProjectGallery";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { developments } from "@/content/developments";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Completed and ongoing Chapelhill projects in Lagos and Abuja.",
};

// Client imagery only. Stock photography and the build-sequence video frames
// are never shown here, because this page presents Chapelhill's own projects.
const projects: GalleryProject[] = developments.flatMap((d) =>
  d.images.map((im, i) => ({
    id: `${d.slug}-${i}`,
    src: im.src,
    width: im.width,
    height: im.height,
    title: `${d.name}, ${d.area}`,
    alt: im.alt,
    category: im.render ? "ongoing" : "completed",
    render: im.render,
  })),
);

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Our work,"
        accent="up close."
        intro="Completed homes and developments in progress across Lagos and Abuja."
        crumbs={[{ label: "Gallery" }]}
      />
      <section aria-label="Project gallery" className="container-luxe pt-4 pb-24 sm:pb-36">
        <ProjectGallery projects={projects} />
        <div className="border-ink/15 mt-16 rounded-[22px] border border-dashed p-8 sm:p-10">
          <p className="text-xl font-medium tracking-[-0.02em]">
            A full photo collection is on its way. <PlaceholderTag className="ml-2" label="Photo shoot pending" />
          </p>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            We are photographing completed homes and ongoing sites. Ask us on WhatsApp for recent progress photos and
            videos of any development.
          </p>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
