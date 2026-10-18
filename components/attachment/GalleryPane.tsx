import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LegendList, type LegendListRenderItemProps } from '@legendapp/list/react-native';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

import { PHOTOS, type Photo } from './photos';
import { colors, getSheetFrame, grid, menuBar, sheet } from './theme';

const SHEET = getSheetFrame();
const CELL = (SHEET.width - grid.gap * (grid.columns - 1)) / grid.columns;

/** Leaves room for the floating menu bar so the last row can be scrolled clear of it. */
const BOTTOM_PADDING = menuBar.height + menuBar.bottomInset + 8;

/**
 * The list occupies everything below the header and the "limited access" banner. Passing it
 * up front stops Legend List from over-allocating containers on the very first pass.
 */
const LIST_SIZE = { width: SHEET.width, height: SHEET.height - sheet.headerHeight };

type CellProps = {
  photo: Photo;
  selected: boolean;
  onToggle: (id: string) => void;
};

const PhotoCell = ({ photo, selected, onToggle }: CellProps) => (
  <Pressable style={styles.cell} onPress={() => onToggle(photo.id)}>
    <Image
      source={{ uri: photo.uri }}
      style={styles.image}
      contentFit="cover"
      transition={140}
      recyclingKey={photo.id}
      placeholderContentFit="cover"
      cachePolicy="memory-disk"
    />
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected ? (
        <SymbolView name="checkmark" size={13} tintColor="#FFFFFF" type="monochrome" weight="bold" />
      ) : null}
    </View>
  </Pressable>
);

/**
 * While the sheet is mid-morph its contents are scaled down, and Legend List sizes its
 * container pool from what it measures on screen — at 10% scale it concludes that thirty
 * rows are visible and allocates a container for every photo in the list. Holding the data
 * back to what actually fits until the sheet has settled avoids that burst; at that scale
 * the extra rows are a few pixels tall and nobody sees them arrive.
 */
const INITIAL_ROWS = 12;

export const GalleryPane = ({ settled }: { settled: boolean }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<Photo>) => (
      <PhotoCell photo={item} selected={!!selected[item.id]} onToggle={toggle} />
    ),
    [selected, toggle]
  );

  return (
    <LegendList
      data={settled ? PHOTOS : PHOTOS.slice(0, INITIAL_ROWS * grid.columns)}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={grid.columns}
      columnWrapperStyle={columnWrapper}
      estimatedItemSize={CELL + grid.gap}
      estimatedListSize={LIST_SIZE}
      drawDistance={CELL * 2}
      recycleItems
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const keyExtractor = (item: Photo) => item.id;
const columnWrapper = { gap: grid.gap } as const;

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: BOTTOM_PADDING,
  },
  cell: {
    height: CELL,
    marginBottom: grid.gap,
    backgroundColor: colors.cellPlaceholder,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  checkbox: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
