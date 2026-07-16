 //this part takes care of getting the actual data and positioning them 

 export const SATELLITES = [

    {
        name: "iss",
        displayName: "International Space Station",
        color: 0xffffff,
        altitude: 408,      // km
        inclination: 51.64, // graus
        period: 92.68,      // minutos
        size: [0.45,0.12,0.28]
    },

    {
        name: "hubble",
        displayName: "Hubble Space Telescope",
        color: 0x6ab8ff,
        altitude: 540,
        inclination: 28.47,
        period: 95.42,
        size: [0.18,0.18,0.45]
    },

    {
        name: "jwst",
        displayName: "James Webb Space Telescope",
        color: 0xffbb55,
        altitude: 1500000, // L2
        inclination: 0,
        period: 180,
        size: [0.55,0.25,0.55]
    },

    {
        name: "sentinel2a",
        displayName: "Sentinel-2A",
        color: 0x44dd88,
        altitude: 786,
        inclination: 98.62,
        period: 100.6,
        size: [0.18,0.10,0.30]
    },

    {
        name: "landsat9",
        displayName: "Landsat 9",
        color: 0xffd000,
        altitude: 705,
        inclination: 98.2,
        period: 98.9,
        size: [0.20,0.12,0.35]
    }

];