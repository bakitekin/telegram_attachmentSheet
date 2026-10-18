/**
 * Placeholder gallery contents. Real Unsplash photos, requested at grid resolution
 * so the list has something representative to recycle while the picker is wired up.
 */
const UNSPLASH_IDS = [
  'photo-1506744038136-46273834b3fb',
  'photo-1518791841217-8f162f1e1131',
  'photo-1494790108377-be9c29b29330',
  'photo-1511485977113-f34c92461ad9',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1441974231531-c6227db76b6e',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1426604966848-d7adac402bff',
  'photo-1472214103451-9374bd1c798e',
  'photo-1433086966358-54859d0ed716',
  'photo-1418065460487-3e41a6c84dc5',
  'photo-1501785888041-af3ef285b470',
  'photo-1439853949127-fa647821eba0',
  'photo-1504198453319-5ce911bafcde',
  'photo-1519681393784-d120267933ba',
  'photo-1465101162946-4377e57745c3',
  'photo-1444927714506-8492d94b4e3d',
  'photo-1490750967868-88aa4486c946',
  'photo-1475924156734-496f6cac6ec1',
  'photo-1418985991508-e47386d96a71',
  'photo-1552083375-1447ce886485',
  'photo-1493246507139-91e8fad9978e',
  'photo-1470252649378-9c29740c9fa8',
  'photo-1502082553048-f009c37129b9',
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1508739773434-c26b3d09e071',
  'photo-1469474968028-56623f02e42e',
  'photo-1454372182658-c712e4c5a1db',
  'photo-1444464666168-49d633b86797',
];

export type Photo = {
  id: string;
  uri: string;
  /** Rendered under the image so recycled cells never flash white. */
  placeholderColor: string;
};

const PLACEHOLDER_COLORS = ['#C9CDD4', '#D3CEC7', '#C6CFC9', '#D5CBD3', '#CBD1D8', '#D2D2CC'];

export const PHOTOS: Photo[] = Array.from({ length: 120 }, (_, index) => {
  const id = UNSPLASH_IDS[index % UNSPLASH_IDS.length];
  return {
    id: `${id}-${index}`,
    uri: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=400&q=70`,
    placeholderColor: PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length],
  };
});
