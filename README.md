# Telegram Attachments

A paperclip button that morphs into a full attachment sheet, built with React Native, Expo, and a native `UISegmentedControl`.

Tap the paperclip to grow it into the sheet, drag the header to expand or dismiss it, and switch panes from the floating glass bar.

## Stack

- [Expo](https://expo.dev) (SDK 56)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) — drives the morph, the backdrop, and every pane cross-fade
- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) — the pan gesture that resizes and dismisses the sheet
- [expo-glass-effect](https://docs.expo.dev/versions/latest/sdk/glass-effect/) — liquid glass on the sheet, menu bar, and header buttons
- [expo-symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) — SF Symbols for the paperclip, segments, and pane rows
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — impact on open, selection on segment change
- [Legend List](https://legendapp.com/open-source/list/) — recycled three-column photo grid
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) — memory-disk cached grid cells

## How it works

The button and the sheet are **one view, not two**. [`components/attachment/AttachmentSheet.tsx`](components/attachment/AttachmentSheet.tsx) keeps a single `progress` shared value and interpolates `left`, `top`, `width`, `height`, and all four corner radii from the button's frame to the sheet's. The contents are laid out once at full sheet width and then scaled by `contentScale` to fit whatever the frame currently measures, so nothing reflows mid-flight — a `transformOrigin: 'top left'` scale is all that runs on the UI thread.

The dim behind the sheet does not ride the spring. It runs on its own `withTiming` curve, because the measured backdrop alpha follows a decelerating ramp to 0.28 while the sheet is still overshooting. All the timing constants — spring duration, damping ratio, corner radii, insets — live in [`components/attachment/theme.ts`](components/attachment/theme.ts), each derived from frame-by-frame measurements of a reference recording and expressed as a ratio so it survives other screen sizes.

Dragging is asymmetric. A `Gesture.Pan` moves `sheetTop` while the bottom edge stays pinned, so pulling up *grows* the sheet; pushing below the resting detent slides the whole thing down at fixed height, which is what makes a downward drag read as dismissal instead of a shrink. Past the expanded detent, travel is multiplied by `overshootResistance`. Release picks a detent from position and velocity, or calls `close` outright.

Segments never swap. [`components/attachment/PaneLayer.tsx`](components/attachment/PaneLayer.tsx) stacks every visited pane absolutely and cross-fades opacity, so scroll position and typed text survive a switch. The movement you feel on tap belongs to the sheet, not the pane: `dip` runs a `withSequence` that drops the frame 10pt and springs it back.

- `frameStyle` — interpolates the shared frame from button to sheet on `progress`
- `openHeight` / `expansion` — derived values that separate "grew taller" from "slid away"
- `createDrag` — a fresh pan per attachment point, gated with `activeOffsetY` so buttons still take taps
- `glassKey` — remounts glass layers once the sheet settles, since `UIVisualEffectView` installs its effect on a single layout pass and that pass happens while the sheet is still invisible

The bar itself is a real `UISegmentedControl` in [`modules/segmented-control/`](modules/segmented-control/) — the selection indicator and its transition come from UIKit, and the native side scrolls the overflowing segments, which a React Native `ScrollView` can't do because the control eats the drag first.

## Project layout

```
App.tsx                              Entry — providers, status bar, mounts Container
components/Container.tsx             Chat screen — wallpaper, header, input bar, sheet
components/attachment/               The sheet: morph, drag, panes, glass menu bar
components/attachment/theme.ts       Measured layout constants, springs, colors
components/attachment/panes/         One component per segment (gallery, poll, audio…)
components/chat/                     Static chat chrome behind the sheet
modules/segmented-control/           Native iOS UISegmentedControl view module
assets/                              Icons and splash
```

## Run

```sh
git clone <repo-url>
cd telegram-attachments
npm install
npx expo run:ios
# or
npx expo run:android
```

## Author

Made by [@Fx_SoldieRR](https://x.com/Fx_SoldieRR).

## License

MIT
