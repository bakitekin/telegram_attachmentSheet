import type { ComponentType } from 'react';
import { GlassView, type GlassViewProps } from 'expo-glass-effect';

/**
 * The native side reads a `borderRadius` prop to shape the glass itself — rounding the layer
 * alone does not round the effect — but that prop is missing from the published types, which
 * only cover `ViewProps`. React Native does flatten style keys into the same prop payload, so
 * a style-level radius reaches it too; passing it explicitly just makes the intent legible.
 */
export const Glass = GlassView as unknown as ComponentType<
  GlassViewProps & {
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderCurve?: 'circular' | 'continuous';
  }
>;
