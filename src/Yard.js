const ROMULUS_NORTH_FENCE = [
  { value: "None", label: "None" },
  { value: "TA 01", label: "TA 1" },
  { value: "TA 02", label: "TA 2" },
  { value: "TA 03", label: "TA 3" },
  { value: "TA 04", label: "TA 4" },
  { value: "TA 05", label: "TA 5" },
  { value: "TA 06", label: "TA 6" },
  ...Array.from({ length: 25 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  })),
  { value: "NP 1", label: "NP-NF 1" },
  { value: "NP 2", label: "NP-NF 2" },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: `${i + 26}`,
    label: `${i + 26}`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    value: `Curb ${i + 1}`,
    label: `Curb ${i + 1}`,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    value: `WT ${i + 1}`,
    label: `WT ${i + 1}`,
  })),
  { value: "B 1", label: "B-NF 1" },
  { value: "B 2", label: "B-NF 2" },
  { value: "B 3", label: "B-NF 3" },
];

const ROMULUS_SOUTH_FENCE = [
  { value: "None", label: "None" },
  { value: "Bs 1", label: "B-SF 1" },
  { value: "Bs 2", label: "B-SF 2" },
  { value: "Bs 3", label: "B-SF 3" },
  { value: "Bs 4", label: "B-SF 4" },
  ...Array.from({ length: 29 }, (_, i) => ({
    value: `${i + 301}`,
    label: `${i + 301}`,
  })),
  { value: "NPs 1", label: "NP-SF 1" },
  ...Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 330}`,
    label: `${i + 330}`,
  })),
  { value: "NPs 2", label: "NP-SF 2" },
  { value: "NPs 3", label: "NP-SF 3" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: `${i + 360}`,
    label: `${i + 360}`,
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    value: `Bs ${i + 5}`,
    label: `B-SF ${i + 5}`,
  })),
];

export const YARDS = [
  {
    id: "default-app-id",
    name: "Kroger Romulus",
    passcode: "1234",
    trailerPrefix: "3",
    trailerLength: 6,
    radioGroups: [
      {
        id: "loadStatus",
        label: "Trailer Status",
        options: ["Empty", "Full", "Salvage"],
      },
    ],
    checkboxes: [
      { id: "needsFuel", label: "Needs Fuel" },
      { id: "noFuelNeeded", label: "No Fuel Needed" },
      { id: "seasonal", label: "Seasonal" },
      { id: "palletShuttle", label: "Pallet Shuttle" },
    ],
    parkingZones: [
      {
        id: "northFence",
        shortCode: "NF",
        label: "North Fence Line",
        spots: ROMULUS_NORTH_FENCE,
      },
      {
        id: "southFence",
        shortCode: "SF",
        spots: ROMULUS_SOUTH_FENCE,
      },
    ],
  },
  {
    id: "saginaw-aldi",
    name: "Saginaw Aldi",
    passcode: "5678",
    trailerPrefix: "",
    trailerLength: null,
    radioGroups: [
      {
        id: "loadStatus",
        label: "Load Type",
        options: ["Inbound", "Outbound", "Empty", "Hold"],
      },
      {
        id: "tempZone",
        label: "Temp Zone",
        options: ["Frozen", "Perishable", "Dry"],
      },
    ],
    checkboxes: [
      { id: "needsFuel", label: "Reefer Fuel Needed" },
      { id: "sealVerified", label: "Seal Verified" },
    ],
    parkingZones: [
      {
        id: "door",
        shortCode: "DR",
        label: "Dock Door",
        spots: [
          "None",
          ...Array.from({ length: 30 }, (_, i) => `Door ${i + 1}`),
        ],
      },
      {
        id: "lot",
        shortCode: "LOT",
        label: "Yard Lot",
        spots: ["None", "lot A-1", "Lot A-2", "Lot B-1", "Lot B-2", "Overflow"],
      },
    ],
  },
];
