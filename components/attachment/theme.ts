import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Every number here was measured off the reference screen recording (1206x2622 @3x,
 * i.e. a 402x874pt viewport) and then expressed as a ratio so it holds on other devices.
 */
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

/** One physical pixel, used for the hairline gaps between grid cells. */
export const onePixel = 1 / PixelRatio.get();

export const colors = {
  /** Sampled from the sheet background in the recording. */
  sheet: '#F0F0F0',
  /** Sampled from the MANAGE pill: rgb(58, 136, 176). */
  accent: '#3A88B0',
  label: '#1E1E1E',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: 'rgba(60, 60, 67, 0.45)',
  separator: 'rgba(60, 60, 67, 0.18)',
  closeButton: '#FFFFFF',
  grabber: 'rgba(60, 60, 67, 0.22)',
  /**
   * The menu bar reads as near-white, with its selection indicator a shade *darker* rather
   * than brighter — a grey pill on a white capsule, not the reverse.
   */
  menuBar: 'rgba(255, 255, 255, 0.94)',
  menuBarIndicator: 'rgba(120, 120, 128, 0.2)',
  /** The bar's glyphs and labels sit a touch softer than the sheet's own body text. */
  menuBarContent: '#2C2C2C',
  /**
   * The wallpaper darkens by a constant factor of 0.727 when the sheet opens,
   * which is a flat black overlay at 28% opacity — no blur.
   */
  backdrop: 'rgba(0, 0, 0, 0.28)',
  fieldPlaceholder: 'rgba(60, 60, 67, 0.4)',
  cellPlaceholder: '#D8D8DC',
};

/** The chat's message input row, in the collapsed state. */
export const inputBar = {
  /** Horizontal margin of the paperclip / mic buttons: measured 25.7pt on a 402pt screen. */
  sideInset: 26,
  /** Both circular buttons measured 39.7pt across. */
  buttonSize: 40,
  /** Gap between a circular button and the message pill. */
  gap: 6,
  /**
   * The bar's bottom edge sat 28pt above the screen bottom, which is 6pt *inside*
   * the 34pt home-indicator inset.
   */
  homeIndicatorOverlap: 6,
  minBottomInset: 8,
};

/** The expanded attachment sheet. */
export const sheet = {
  /** Measured 5.3pt on all three free edges. */
  sideInset: 6,
  bottomInset: 6,
  /**
   * Measured top edge at 290.7pt on an 874pt screen, i.e. the sheet occupies the
   * bottom 66.2% of the viewport.
   */
  heightRatio: 578 / 874,
  /**
   * Fitting a circle through the measured corner profile gives r = 37.3pt. iOS draws
   * these as continuous curves, so the nominal radius runs slightly higher.
   */
  radius: 38,
  headerHeight: 129,
  grabber: { width: 36, height: 5, top: 5, radius: 2.5 },
  closeButton: { size: 42, inset: 15.5 },
  titleSize: 17.5,
  /** Gap above the expanded sheet, measured from the top safe-area inset. */
  expandedTopInset: 10,
  /** How far the sheet has to be dragged below its resting top edge to dismiss. */
  dismissTravel: 110,
  /** Fraction of a drag past the expanded detent that still moves the sheet. */
  overshootResistance: 0.35,
  /**
   * Expanded, the sheet's bottom corners sit right in the display's own, so they round off
   * to match rather than keeping the tighter radius the rest of the sheet uses.
   */
  expandedBottomRadius: 54,
};

/** The floating segmented control that sits over the bottom of the sheet content. */
export const menuBar = {
  /** Measured 21pt..381pt absolute, i.e. 15.7pt inside each sheet edge. */
  sideInset: 15.5,
  /**
   * Sized so the selection indicator clears the bar's edges by about the same 4pt on every
   * side; a taller bar leaves a wide vertical gap the horizontal one never matches.
   */
  height: 58,
  /** The reference leaves far less room below the bar than beside it. */
  bottomInset: 8,
  /** Fitting the corner profile 16pt below the bar's top edge gives r ≈ 27. */
  radius: 28,
  /**
   * Each button is its icon-and-label block plus this padding, which also sets the pitch —
   * the control ends up wider than the bar and scrolls horizontally inside it.
   */
  contentPadding: { horizontal: 12, vertical: 6 },
  /**
   * Proportions taken off the reference bar: the glyph runs about 40% of the bar's height,
   * the label's cap about 14%, and the gap between them about 12%.
   */
  iconSize: 25,
  fontSize: 12.5,
  iconSpacing: 8,
  /** Holds the indicator to a wide pill rather than letting it grow into a circle. */
  verticalInset: 2,
};

export const grid = {
  columns: 3,
  /** The separators between cells measured 0.67pt — a 2px hairline. */
  gap: onePixel * 2,
};

/** Resolved, absolute layout for the current device. */
export function getSheetFrame() {
  const height = Math.round(screen.height * sheet.heightRatio);
  const width = screen.width - sheet.sideInset * 2;
  return {
    left: sheet.sideInset,
    top: screen.height - sheet.bottomInset - height,
    width,
    height,
  };
}

/** Resolved frame of the collapsed paperclip button, in window coordinates. */
export function getButtonFrame(bottomSafeAreaInset: number) {
  const bottom = Math.max(
    bottomSafeAreaInset - inputBar.homeIndicatorOverlap,
    inputBar.minBottomInset
  );
  return {
    left: inputBar.sideInset,
    top: screen.height - bottom - inputBar.buttonSize,
    width: inputBar.buttonSize,
    height: inputBar.buttonSize,
  };
}

/**
 * Frame-by-frame, the reference sheet peaks 5.3pt past its final top edge — 1.0% of the
 * 515pt travel, which is a damping ratio of 0.83 — then settles. Recording this screen back
 * and measuring the same way puts the overshoot at exactly the reference's 285.3pt and the
 * gap between crossing the final edge and peaking at 42ms against the reference's 47ms, so
 * the duration is nudged up from 280 to relax it by that margin.
 * The close is quicker and does not bounce.
 */
export const springs = {
  open: { duration: 320, dampingRatio: 0.83 },
  close: { duration: 220, dampingRatio: 1 },
  /** Snapping between the collapsed and expanded detents after a drag. */
  detent: { duration: 320, dampingRatio: 0.9 },
} as const;

/**
 * Switching segments. The pane itself only cross-fades; the sheet answers the tap by
 * dipping and springing back, which is the movement the reference shows — tracked frame by
 * frame it sits about 10pt low, returns over roughly 215ms and overshoots by a point.
 */
export const paneTransition = {
  fadeDuration: 150,
  /** How far the whole sheet drops before springing back. */
  dip: 10,
  dipDuration: 180,
  recover: { duration: 340, dampingRatio: 0.66 },
} as const;

/**
 * The backdrop does not ride the spring — measured alpha follows roughly `t^0.65` up to
 * 0.28 over 420ms, which is a decelerating curve of its own.
 */
export const backdropTiming = {
  open: { duration: 420 },
  close: { duration: 260 },
} as const;
