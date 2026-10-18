import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';

import { Glass } from './Glass';
import { MenuBar } from './MenuBar';
import { PaneLayer } from './PaneLayer';
import { SheetHeader, CircleButton } from './SheetHeader';
import { GalleryPane } from './GalleryPane';
import { GalleryNotice } from './panes/GalleryNotice';
import { TextPane } from './panes/TextPane';
import { FilePane } from './panes/FilePane';
import { LocationPane } from './panes/LocationPane';
import { PollPane } from './panes/PollPane';
import { ChecklistPane } from './panes/ChecklistPane';
import { AudioPane } from './panes/AudioPane';
import { ContactPane } from './panes/ContactPane';
import { SEGMENTS, type Segment } from './segments';
import {
  backdropTiming,
  colors,
  paneTransition,
  getButtonFrame,
  getSheetFrame,
  inputBar,
  menuBar,
  sheet,
  springs,
  screen,
} from './theme';

const SHEET = getSheetFrame();
const SHEET_BOTTOM = SHEET.top + SHEET.height;
const BUTTON_RADIUS = inputBar.buttonSize / 2;

/**
 * The paperclip button and the expanded sheet are the same view. One progress value drives
 * its frame from one to the other; the sheet's contents are laid out once at full size and
 * scaled to fit whatever the frame currently is, so nothing reflows mid-flight.
 */
export const AttachmentSheet = () => {
  const insets = useSafeAreaInsets();
  const button = useMemo(() => getButtonFrame(insets.bottom), [insets.bottom]);

  /** Top edge of the expanded sheet. Dragging moves it; releasing snaps it to a detent. */
  const expandedTop = Math.max(insets.top + sheet.expandedTopInset, sheet.bottomInset);
  const sheetTop = useSharedValue(SHEET.top);
  const dragOrigin = useSharedValue(SHEET.top);

  const progress = useSharedValue(0);
  /** The dim runs on its own decelerating curve rather than following the sheet's spring. */
  const dim = useSharedValue(0);
  /** Answers a segment tap: the whole sheet drops a little, then springs back. */
  const dip = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  /**
   * Panes mount the first time they are shown and then stay mounted — that is what makes the
   * cross-fade possible and keeps scroll position and typed text across switches. Nothing is
   * mounted before the sheet has ever been opened.
   */
  const [visited, setVisited] = useState<number[]>([]);
  /**
   * True once the sheet has finished its first open. Two things need to know: the menu bar's
   * glass (see its `glassKey` prop) and the photo grid, which both misbehave while the sheet
   * contents are still scaled down mid-morph.
   */
  const [settled, setSettled] = useState(false);
  const markSettled = useCallback(() => setSettled(true), []);

  const open = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisited((current) => (current.includes(0) ? current : [...current, 0]));
    setIsOpen(true);
    progress.value = withSpring(1, springs.open, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(markSettled)();
      }
    });
    dim.value = withTiming(1, { ...backdropTiming.open, easing: Easing.out(Easing.quad) });
  }, [dim, markSettled, progress]);

  const close = useCallback(() => {
    setIsOpen(false);
    progress.value = withSpring(0, springs.close, (finished) => {
      'worklet';
      if (finished) {
        // Back at the button and invisible, so resetting the detent cannot be seen.
        sheetTop.value = SHEET.top;
      }
    });
    dim.value = withTiming(0, { ...backdropTiming.close, easing: Easing.in(Easing.quad) });
  }, [dim, progress, sheetTop]);

  const selectSegment = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setVisited((current) => (current.includes(index) ? current : [...current, index]));
      dip.value = withSequence(
        withTiming(paneTransition.dip, {
          duration: paneTransition.dipDuration,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(0, paneTransition.recover)
      );
    },
    [dip]
  );

  /**
   * Dragging up grows the sheet, since its bottom edge is pinned. Dragging below the resting
   * top edge slides the whole sheet down instead — its height stays put and the bottom runs
   * off-screen, which is what makes a downward drag read as dismissing rather than shrinking.
   */
  const openHeight = useDerivedValue(
    () => SHEET_BOTTOM - Math.min(sheetTop.value, SHEET.top)
  );

  /** 0 at the resting detent, 1 once the sheet has been dragged fully open. */
  const expansion = useDerivedValue(() =>
    interpolate(sheetTop.value, [SHEET.top, expandedTop], [0, 1], Extrapolation.CLAMP)
  );

  /** Expanding also takes the sheet out to both display edges. */
  const openLeft = useDerivedValue(() => interpolate(expansion.value, [0, 1], [SHEET.left, 0]));
  const openWidth = useDerivedValue(() =>
    interpolate(expansion.value, [0, 1], [SHEET.width, screen.width])
  );
  /** How much wider than its resting frame the sheet currently is: 1 at the detent. */
  const expandScale = useDerivedValue(() => openWidth.value / SHEET.width);

  const frameStyle = useAnimatedStyle(() => {
    const p = progress.value;
    // Expanded, the sheet's bottom corners land in the display's own, so they open out to
    // match it instead of holding the tighter radius the rest of the sheet uses.
    // const bottomRadius = interpolate(
    //   expansion.value,
    //   [0, 1],
    //   [sheet.radius, sheet.expandedBottomRadius]
    // );
    return {
      left: interpolate(p, [0, 1], [button.left, openLeft.value]),
      top: interpolate(p, [0, 1], [button.top, sheetTop.value]),
      width: interpolate(p, [0, 1], [button.width, openWidth.value]),
      height: interpolate(p, [0, 1], [button.height, openHeight.value]),
      borderTopLeftRadius: interpolate(p, [0, 1], [BUTTON_RADIUS, sheet.radius]),
      borderTopRightRadius: interpolate(p, [0, 1], [BUTTON_RADIUS, sheet.radius]),
      borderBottomLeftRadius: interpolate(p, [0, 1], [BUTTON_RADIUS, sheet.expandedBottomRadius]),
      borderBottomRightRadius: interpolate(p, [0, 1], [BUTTON_RADIUS, sheet.expandedBottomRadius]),
      // A translate rather than a change of `top`, so the dip reads the same at either
      // detent and never resizes the sheet on the way.
      transform: [{ translateY: dip.value * p }],
    };
  });

  /**
   * Uniform scale mapping the full-size contents onto the frame's current width — expanding
   * past the resting width is just more of the same scale, which is what widens the photo
   * grid with the sheet. Widening the contents by layout instead reflows every column and
   * every image on every frame of the drag, and drops frames doing it.
   */
  const contentScale = useDerivedValue(
    () => interpolate(progress.value, [0, 1], [button.width, openWidth.value]) / SHEET.width
  );

  /** In the reference the contents reach full alpha within the first 50-70ms of the move. */
  const contentStyle = useAnimatedStyle(() => ({
    // Laid out short by whatever the scale will add back, so the contents still end up
    // exactly as tall as the frame once expanded.
    height: openHeight.value / expandScale.value,
    opacity: interpolate(progress.value, [0.02, 0.22], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: contentScale.value }],
  }));

  /**
   * Everything in the sheet grows with it; the menu bar holds still. It takes back the
   * expansion's scale and the ground the sheet's left edge gave up, leaving it the same size
   * in the same place on screen. Both are transforms, and the counter-scale cancels the
   * content's exactly — resizing the bar by layout would re-render its glass and re-measure
   * the native segmented control on every frame.
   */
  const menuBarStyle = useAnimatedStyle(() => {
    const scale = expandScale.value;
    return {
      transform: [
        {
          translateX:
            (SHEET.left + menuBar.sideInset - openLeft.value) / scale - menuBar.sideInset,
        },
        { scale: 1 / scale },
      ],
    };
  });

  /** The opaque sheet material fades in over the glass as the button grows. */
  const surfaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.03, 0.35], [0, 1], Extrapolation.CLAMP),
  }));

  const paperclipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1], [1, 0], Extrapolation.CLAMP),
  }));

  const backdropStyle = useAnimatedStyle(() => ({ opacity: dim.value }));

  /**
   * Built per attachment point rather than shared: a gesture instance belongs to one
   * detector, and the sheet's whole non-scrolling header — title row and, on the gallery,
   * the access banner — should drag. Everything below that scrolls its own content.
   */
  const createDrag = useCallback(
    () =>
      Gesture.Pan()
        // Only claims the touch on vertical movement, so buttons up there still take taps.
        .activeOffsetY([-8, 8])
        .failOffsetX([-16, 16])
        .onStart(() => {
          dragOrigin.value = sheetTop.value;
        })
        .onUpdate((event) => {
          const next = dragOrigin.value + event.translationY;
          sheetTop.value =
            next < expandedTop
              ? expandedTop - (expandedTop - next) * sheet.overshootResistance
              : next;
        })
        .onEnd((event) => {
          if (event.velocityY > 900 || sheetTop.value > SHEET.top + sheet.dismissTravel) {
            runOnJS(close)();
            return;
          }
          const midpoint = (expandedTop + SHEET.top) / 2;
          const expanding =
            event.velocityY < -450 || (sheetTop.value < midpoint && event.velocityY < 450);
          sheetTop.value = withSpring(expanding ? expandedTop : SHEET.top, springs.detent);
        }),
    [close, dragOrigin, expandedTop, sheetTop]
  );

  const headerDrag = useMemo(() => createDrag(), [createDrag]);
  const noticeDrag = useMemo(() => createDrag(), [createDrag]);

  const glassKey = settled ? 'settled' : 'initial';
  const segment = SEGMENTS[selectedIndex];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View style={[styles.morph, frameStyle]}>
        <Glass
          style={StyleSheet.absoluteFill}
          glassEffectStyle="regular"
          borderRadius={isOpen ? sheet.radius : BUTTON_RADIUS}
        />
        <Animated.View style={[StyleSheet.absoluteFill, styles.surface, surfaceStyle]} />

        {visited.length > 0 ? (
          <Animated.View
            style={[styles.content, contentStyle]}
            pointerEvents={isOpen ? 'box-none' : 'none'}
          >
            <GestureDetector gesture={headerDrag}>
              <View>
                <SheetHeader
                  title={segment.headerTitle}
                  glassKey={glassKey}
                  withDisclosure={segment.withDisclosure}
                  onClose={close}
                  trailing={<TrailingActions kind={segment.trailing} glassKey={glassKey} />}
                />
              </View>
            </GestureDetector>
            <View style={styles.panes}>
              {visited.map((index) => (
                <PaneLayer key={SEGMENTS[index].key} active={index === selectedIndex}>
                  <Pane segment={SEGMENTS[index]} settled={settled} drag={noticeDrag} />
                </PaneLayer>
              ))}
            </View>
            <MenuBar
              selectedIndex={selectedIndex}
              onSelect={selectSegment}
              glassKey={glassKey}
              style={menuBarStyle}
            />
          </Animated.View>
        ) : null}

        <Animated.View style={[styles.paperclip, paperclipStyle]} pointerEvents="none">
          <SymbolView name="paperclip" size={21} tintColor={colors.label} type="monochrome" />
        </Animated.View>

        {isOpen ? null : (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={open}
            accessibilityRole="button"
            accessibilityLabel="Attach"
          />
        )}
      </Animated.View>
    </View>
  );
};

const TrailingActions = ({
  kind,
  glassKey,
}: {
  kind?: Segment['trailing'];
  glassKey: string;
}) => {
  if (kind === 'search') {
    return <CircleButton symbol="magnifyingglass" size={20} glassKey={glassKey} />;
  }
  if (kind === 'undo-redo') {
    return (
      <>
        <CircleButton symbol="arrow.uturn.backward" size={19} weight="medium" glassKey={glassKey} />
        <CircleButton symbol="arrow.uturn.forward" size={19} weight="medium" glassKey={glassKey} />
      </>
    );
  }
  return null;
};

const Pane = ({
  segment,
  settled,
  drag,
}: {
  segment: Segment;
  settled: boolean;
  drag: ReturnType<typeof Gesture.Pan>;
}) => {
  switch (segment.key) {
    case 'gallery':
      return (
        <>
          <GestureDetector gesture={drag}>
            <View>
              <GalleryNotice />
            </View>
          </GestureDetector>
          <GalleryPane settled={settled} />
        </>
      );
    case 'article':
      return <TextPane />;
    case 'file':
      return <FilePane />;
    case 'location':
      return <LocationPane />;
    case 'poll':
      return <PollPane />;
    case 'checklist':
      return <ChecklistPane />;
    case 'audio':
      return <AudioPane />;
    case 'contact':
      return <ContactPane />;
  }
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.backdrop,
  },
  morph: {
    position: 'absolute',
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  surface: {
    backgroundColor: colors.sheet,
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SHEET.width,
    transformOrigin: 'top left',
  },
  panes: {
    flex: 1,
  },
  paperclip: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
