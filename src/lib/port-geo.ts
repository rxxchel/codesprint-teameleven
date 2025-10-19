export type PortGeoPoint = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

export const PORT_COORDINATES: Record<string, PortGeoPoint> = {
  AEJEA: {
    code: "AEJEA",
    name: "Jebel Ali",
    lat: 25.0108,
    lng: 55.0618,
  },
  AEKHL: {
    code: "AEKHL",
    name: "Khalifa Port",
    lat: 24.765,
    lng: 54.556,
  },
  BEANR: {
    code: "BEANR",
    name: "Antwerp",
    lat: 51.2637,
    lng: 4.4123,
  },
  BRSSZ: {
    code: "BRSSZ",
    name: "Santos",
    lat: -23.954,
    lng: -46.326,
  },
  CNNBG: {
    code: "CNNBG",
    name: "Ningbo",
    lat: 29.871,
    lng: 121.544,
  },
  CNQDG: {
    code: "CNQDG",
    name: "Qingdao",
    lat: 36.067,
    lng: 120.382,
  },
  CNSHA: {
    code: "CNSHA",
    name: "Shanghai",
    lat: 31.2304,
    lng: 121.4737,
  },
  CNSZX: {
    code: "CNSZX",
    name: "Shenzhen",
    lat: 22.5431,
    lng: 114.0579,
  },
  CNTXG: {
    code: "CNTXG",
    name: "Tianjin",
    lat: 38.9833,
    lng: 117.7333,
  },
  CNXMN: {
    code: "CNXMN",
    name: "Xiamen",
    lat: 24.4798,
    lng: 118.0895,
  },
  CNYTN: {
    code: "CNYTN",
    name: "Yantian",
    lat: 22.56,
    lng: 114.287,
  },
  DEBRV: {
    code: "DEBRV",
    name: "Bremerhaven",
    lat: 53.5396,
    lng: 8.5821,
  },
  DEHAM: {
    code: "DEHAM",
    name: "Hamburg",
    lat: 53.5511,
    lng: 9.9937,
  },
  ESALG: {
    code: "ESALG",
    name: "Algeciras",
    lat: 36.1408,
    lng: -5.4562,
  },
  ESVLC: {
    code: "ESVLC",
    name: "Valencia",
    lat: 39.4549,
    lng: -0.3169,
  },
  FRLEH: {
    code: "FRLEH",
    name: "Le Havre",
    lat: 49.4944,
    lng: 0.1079,
  },
  GBFXT: {
    code: "GBFXT",
    name: "Felixstowe",
    lat: 51.9617,
    lng: 1.3505,
  },
  GBSOU: {
    code: "GBSOU",
    name: "Southampton",
    lat: 50.904,
    lng: -1.4043,
  },
  GRPIR: {
    code: "GRPIR",
    name: "Piraeus",
    lat: 37.9497,
    lng: 23.6417,
  },
  HKHKG: {
    code: "HKHKG",
    name: "Hong Kong",
    lat: 22.3193,
    lng: 114.1694,
  },
  IDJKT: {
    code: "IDJKT",
    name: "Jakarta",
    lat: -6.106,
    lng: 106.883,
  },
  INNSA: {
    code: "INNSA",
    name: "Nhava Sheva",
    lat: 18.9535,
    lng: 72.9527,
  },
  ITGIT: {
    code: "ITGIT",
    name: "Gioia Tauro",
    lat: 38.43,
    lng: 15.898,
  },
  ITSPE: {
    code: "ITSPE",
    name: "La Spezia",
    lat: 44.1069,
    lng: 9.8287,
  },
  JPOSA: {
    code: "JPOSA",
    name: "Osaka",
    lat: 34.6653,
    lng: 135.43,
  },
  JPTYO: {
    code: "JPTYO",
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
  },
  KRPUS: {
    code: "KRPUS",
    name: "Busan",
    lat: 35.1796,
    lng: 129.0756,
  },
  MYPKG: {
    code: "MYPKG",
    name: "Port Klang",
    lat: 3.0206,
    lng: 101.3839,
  },
  MYTPP: {
    code: "MYTPP",
    name: "Tanjung Pelepas",
    lat: 1.362,
    lng: 103.536,
  },
  NLRTM: {
    code: "NLRTM",
    name: "Rotterdam",
    lat: 51.9244,
    lng: 4.4777,
  },
  PAPTY: {
    code: "PAPTY",
    name: "Panama City",
    lat: 8.949,
    lng: -79.555,
  },
  SADMM: {
    code: "SADMM",
    name: "Dammam",
    lat: 26.5099,
    lng: 50.214,
  },
  SGSIN: {
    code: "SGSIN",
    name: "Singapore",
    lat: 1.2644,
    lng: 103.822,
  },
  THLCB: {
    code: "THLCB",
    name: "Laem Chabang",
    lat: 13.086,
    lng: 100.89,
  },
  TWKHH: {
    code: "TWKHH",
    name: "Kaohsiung",
    lat: 22.6273,
    lng: 120.3014,
  },
  USLAX: {
    code: "USLAX",
    name: "Los Angeles",
    lat: 33.7405,
    lng: -118.276,
  },
  USNYC: {
    code: "USNYC",
    name: "New York / New Jersey",
    lat: 40.6681,
    lng: -74.0451,
  },
  USSEA: {
    code: "USSEA",
    name: "Seattle",
    lat: 47.6062,
    lng: -122.3321,
  },
  VNSGN: {
    code: "VNSGN",
    name: "Ho Chi Minh City",
    lat: 10.77,
    lng: 106.7,
  },
};

export const BU_COORDINATES: Record<string, PortGeoPoint> = {
  "PANAMA CITY": { ...PORT_COORDINATES.PAPTY },
  BUSAN: { ...PORT_COORDINATES.KRPUS },
  DAMMAM: { ...PORT_COORDINATES.SADMM },
  JAKARTA: { ...PORT_COORDINATES.IDJKT },
  "LAEM CHABANG": { ...PORT_COORDINATES.THLCB },
  MUMBAI: { ...PORT_COORDINATES.INNSA },
  SINGAPORE: { ...PORT_COORDINATES.SGSIN },
  TIANJIN: { ...PORT_COORDINATES.CNTXG },
  ANTWERP: { ...PORT_COORDINATES.BEANR },
};
