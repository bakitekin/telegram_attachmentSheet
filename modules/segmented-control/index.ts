import { requireNativeView } from 'expo';
import type { SFSymbol } from 'expo-symbols';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
import type { ComponentType } from 'react';

export type SegmentItem = {
  /** Label drawn underneath the icon. */
  title: string;
  /** SF Symbol name drawn above the label. */
  systemImage: SFSymbol;
};

export type SegmentedControlSelectEvent = {
  nativeEvent: { index: number };
};

export type SegmentedControlProps = {
  segments: SegmentItem[];
  selectedIndex: number;
  /**
   * Named `onSelect` rather than `onChange` on purpose: React Native reserves `onChange`
   * as a bubbling event, and reusing it on a custom view throws
   * "Event cannot be both direct and bubbling: topChange" at registration time.
   */
  onSelect?: (event: SegmentedControlSelectEvent) => void;
  /** Icon + label color of the selected segment. */
  selectedContentColor?: string;
  /** Icon + label color of every other segment. */
  contentColor?: string;
  /** Point size of the SF Symbol. @default 24 */
  iconSize?: number;
  /** Point size of the label. @default 11 */
  fontSize?: number;
  /** Vertical gap between icon and label. @default 3 */
  iconSpacing?: number;
  /** @default 'medium' */
  iconWeight?: SymbolWeight;
  /** @default 'regular' */
  fontWeight?: SymbolWeight;
  /**
   * Space between a segment's icon-and-label block and the edges of its selection pill.
   * Segments size themselves from it, so this is also what sets the pitch: when the total
   * exceeds the view, the control scrolls horizontally inside it.
   */
  contentPadding?: { horizontal: number; vertical: number };
  /**
   * Inset above and below the control. The selection indicator is sized to the control's
   * height, so this is what keeps it a wide pill instead of growing into a circle.
   */
  verticalInset?: number;
  /** Fill of the selection indicator. Leave unset for the system's own material. */
  indicatorColor?: string;
  style?: StyleProp<ViewStyle>;
};

export type SymbolWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export const isSegmentedControlAvailable = Platform.OS === 'ios';

const SegmentedControl: ComponentType<SegmentedControlProps> = isSegmentedControlAvailable
  ? requireNativeView<SegmentedControlProps>('SegmentedControl')
  : () => null;

export default SegmentedControl;
