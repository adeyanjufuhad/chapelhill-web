// Leadership from chapelhill.com.ng/about-us. Bios are withheld until the
// client supplies them: the current site repeats the COO's bio under the
// Chairman. Two headshots on the current site appear AI-generated and are
// not reused. See CONTENT-NEEDED.md.

export type TeamMember = {
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
};

export const team: TeamMember[] = [
  { name: "Dr. Christopher Inegbedion", role: "Chairman", photo: null, bio: null },
  { name: "Nick Joel Okpanachi", role: "Chief Executive Officer", photo: null, bio: null },
  {
    name: "Stephen Agada",
    role: "Chief Operating Officer",
    photo: "/images/team/stephen-agada.jpg",
    bio: "Stephen brings vast expertise in facility management, projects, procurement and quantity surveying. He holds certifications from Lagos Business School and the UK’s PRINCE2 programme.",
  },
  { name: "Barr. Blessing Agada", role: "Director", photo: "/images/team/blessing-agada.jpg", bio: null },
  { name: "Olueseun", role: "Technical Director", photo: "/images/team/olueseun.png", bio: null },
  { name: "Dennis Baba", role: "Company Secretary & Legal Adviser", photo: "/images/team/dennis-baba.jpg", bio: null },
];
