// Licensed mood photography (Unsplash License: free for commercial use, no
// attribution required; credited in CREDITS.md anyway). Never present these
// as Chapelhill developments: they illustrate places, interiors and services.

export type StockImage = { src: string; alt: string; width: number; height: number; credit: string };

const img = (name: string, alt: string, width: number, height: number, credit: string): StockImage => ({
  src: `/images/stock/${name}.webp`,
  alt,
  width,
  height,
  credit,
});

export const stock = {
  lagosBridgeSky: img("lagos-bridge-sky", "The Lekki-Ikoyi Link Bridge in Lagos under a pale morning sky", 2400, 2556, "Tunde Buremo"),
  lagosBridgePylon: img("lagos-bridge-pylon", "The cable-stayed pylon of the Lekki-Ikoyi Link Bridge, Lagos", 2400, 3343, "Tunde Buremo"),
  lagosLagoonAerial: img("lagos-lagoon-aerial", "Aerial view of boats on the Lagos lagoon beside a city bridge", 2400, 1800, "Malik Buraimoh"),
  lagosSkyline: img("lagos-skyline", "The Lagos skyline under a blue sky", 2400, 4266, "Nupo Deyon Daniel"),
  livingWarm: img("interior-living-warm", "A modern living room with a sectional sofa and tall windows", 2400, 1599, "Aalo Lens"),
  livingView: img("interior-living-view", "A bright living room with floor-to-ceiling windows", 2400, 3397, "Caroline Badran"),
  kitchenLight: img("interior-kitchen-light", "A white kitchen island beside glass doors", 2400, 3600, "Jason Briscoe"),
  kitchenMarble: img("interior-kitchen-marble", "A modern kitchen with marble counters and bar stools", 2400, 1350, "Medea Dzagnidze"),
  handoverKeys: img("handover-keys", "House keys held up in front of a front door", 2400, 1601, "Jakub Żerdzicki"),
  designDrafting: img("design-drafting", "An architect drafting plans with a pencil and scale ruler", 2400, 1350, "Daniel McCullough"),
  designBlueprint: img("design-blueprint", "An architectural blueprint of a multi-storey building", 2400, 1942, "Amsterdam City Archives"),
  siteTeam: img("site-team", "A construction team in hard hats and hi-vis vests inside a concrete structure", 2400, 1600, "Glenov Brankovic"),
  siteAerial: img("site-aerial", "Aerial view of workers placing rebar on a construction site", 2400, 1800, "Glenov Brankovic"),
  siteScaffolding: img("site-scaffolding", "Two builders working on scaffolding against a blue sky", 2400, 3789, "Nik"),
  electrician: img("maintenance-electrician", "An electrician in a yellow hard hat installing wiring", 2400, 1602, "Emmanuel Ikwuegbu"),
  abujaAerial: img("abuja-aerial", "Aerial view of homes in Abuja with hills beyond", 2400, 1600, "Ovinuchi Ejiohuo"),
  abujaTower: img("abuja-tower", "A glass office tower among trees in Abuja", 2400, 3320, "Praise Godwin"),
} satisfies Record<string, StockImage>;
