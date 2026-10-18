import type { SFSymbol } from 'expo-symbols';

export type SegmentKey =
  | 'gallery'
  | 'article'
  | 'file'
  | 'location'
  | 'poll'
  | 'checklist'
  | 'audio'
  | 'contact';

export type Segment = {
  key: SegmentKey;
  /** Label rendered inside the native segmented control. */
  title: string;
  systemImage: SFSymbol;
  /** Title shown in the sheet header for this pane. */
  headerTitle: string;
  /** The gallery's header title doubles as an album picker. */
  withDisclosure?: boolean;
  trailing?: 'search' | 'undo-redo';
};

/** More segments than fit the bar — the control scrolls horizontally inside it. */
export const SEGMENTS: Segment[] = [
  {
    key: 'gallery',
    title: 'Gallery',
    systemImage: 'photo.stack.fill',
    headerTitle: 'Recents',
    withDisclosure: true,
  },
  {
    key: 'article',
    title: 'Article',
    systemImage: 'character.textbox',
    headerTitle: 'Text',
    trailing: 'undo-redo',
  },
  {
    key: 'file',
    title: 'File',
    systemImage: 'doc.fill',
    headerTitle: 'File',
    trailing: 'search',
  },
  {
    key: 'location',
    title: 'Location',
    // No SF Symbol is the reference's solid teardrop; this keeps the row's filled weight.
    systemImage: 'mappin.circle.fill',
    headerTitle: 'Location',
    trailing: 'search',
  },
  {
    key: 'poll',
    title: 'Poll',
    systemImage: 'chart.bar.fill',
    headerTitle: 'Poll',
  },
  {
    key: 'checklist',
    title: 'Checklist',
    systemImage: 'checkmark.square.fill',
    headerTitle: 'Checklist',
  },
  {
    key: 'audio',
    title: 'Audio',
    systemImage: 'play.circle.fill',
    headerTitle: 'Audio',
    trailing: 'search',
  },
  {
    key: 'contact',
    title: 'Contact',
    systemImage: 'person.crop.circle.fill',
    headerTitle: 'Contact',
    trailing: 'search',
  },
];
