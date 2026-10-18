import ExpoModulesCore
import UIKit

/// Space between a segment's icon-and-label block and the edges of its selection pill.
struct ContentPadding: Record {
  @Field var horizontal: Double = 0
  @Field var vertical: Double = 0
}

/// One entry of the segmented control. Mirrors the `SegmentItem` type on the JS side.
struct SegmentItem: Record {
  @Field var title: String = ""
  @Field var systemImage: String = ""
}

/// A thin wrapper around UIKit's `UISegmentedControl`.
///
/// `UISegmentedControl` only accepts *either* a title *or* an image per segment, so to get
/// Telegram's icon-above-label segments we rasterize each segment into a single `UIImage`
/// (SF Symbol on top, label underneath) and hand that to the control. Because the images are
/// `.alwaysOriginal` we own their colors outright, which lets us swap in a tinted variant for
/// whichever segment is selected — that is what produces the blue selected item in the design.
public final class SegmentedControlView: ExpoView {
  let onSelect = EventDispatcher()

  private let control = UISegmentedControl()

  private var items: [SegmentItem] = []
  private var selectedIndex: Int = 0

  private var selectedContentColor: UIColor = .systemBlue
  private var contentColor: UIColor = .label
  private var iconSize: CGFloat = 24
  private var fontSize: CGFloat = 11
  private var iconSpacing: CGFloat = 3
  private var iconWeight: UIImage.SymbolWeight = .medium
  private var fontWeight: UIFont.Weight = .regular
  private var indicatorColor: UIColor?
  /// Inset above and below the control inside the bar. `UISegmentedControl` sizes its
  /// selection indicator to its own height, so shrinking the control is what makes the
  /// indicator a wide pill rather than a circle.
  private var verticalInset: CGFloat = 0
  private var contentPaddingX: CGFloat = 0
  private var contentPaddingY: CGFloat = 0

  /// Width of the widest composed segment, which every segment is then sized to. Derived
  /// rather than configured: a segment is its content plus `contentPadding`, and the control
  /// is laid out at `segments.count` of those — scrolling horizontally whenever that exceeds
  /// the view, which is how the bar can offer more items than fit.
  private var segmentWidth: CGFloat = 0

  private let scrollView = UIScrollView()

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    scrollView.showsHorizontalScrollIndicator = false
    scrollView.showsVerticalScrollIndicator = false
    scrollView.alwaysBounceVertical = false
    scrollView.contentInsetAdjustmentBehavior = .never
    scrollView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(scrollView)

    // Equal-width segments, every one as wide as the broadest composed image; anything
    // past the view's own width becomes scroll range.
    control.apportionsSegmentWidthsByContent = false
    // Display only. With interaction off, hit-testing walks straight past the control to
    // the scroll view, so a drag anywhere on the bar scrolls with nothing to contest it.
    control.isUserInteractionEnabled = false
    scrollView.addSubview(control)

    // Selection comes from this instead. A tap recognizer already fails the moment the
    // finger travels, so press and drag can never be confused for one another.
    scrollView.addGestureRecognizer(
      UITapGestureRecognizer(target: self, action: #selector(handleTap))
    )
  }

  public override func layoutSubviews() {
    super.layoutSubviews()

    scrollView.frame = bounds

    let contentWidth = max(bounds.width, CGFloat(items.count) * segmentWidth)
    let inset = min(verticalInset, bounds.height / 2)
    control.frame = CGRect(
      x: 0,
      y: inset,
      width: contentWidth,
      height: max(0, bounds.height - inset * 2)
    )
    scrollView.contentSize = CGSize(width: contentWidth, height: bounds.height)
    scrollView.alwaysBounceHorizontal = contentWidth > bounds.width
  }

  // MARK: - Props

  func setSegments(_ newItems: [SegmentItem]) {
    items = newItems
    rebuildSegments()
    setNeedsLayout()
  }

  func setSelectedIndex(_ index: Int) {
    selectedIndex = index
    guard control.numberOfSegments > 0 else {
      return
    }
    let clamped = max(0, min(index, control.numberOfSegments - 1))
    guard control.selectedSegmentIndex != clamped else {
      return
    }
    control.selectedSegmentIndex = clamped
    refreshSegmentImages()
  }

  func setSelectedContentColor(_ color: UIColor?) {
    selectedContentColor = color ?? .systemBlue
    refreshSegmentImages()
  }

  func setContentColor(_ color: UIColor?) {
    contentColor = color ?? .label
    refreshSegmentImages()
  }

  func setIconSize(_ size: CGFloat) {
    iconSize = size
    refreshSegmentImages()
  }

  func setFontSize(_ size: CGFloat) {
    fontSize = size
    refreshSegmentImages()
  }

  func setIconSpacing(_ spacing: CGFloat) {
    iconSpacing = spacing
    refreshSegmentImages()
  }

  func setIconWeight(_ weight: String) {
    iconWeight = Self.symbolWeight(from: weight)
    refreshSegmentImages()
  }

  func setFontWeight(_ weight: String) {
    fontWeight = Self.fontWeight(from: weight)
    refreshSegmentImages()
  }

  func setIndicatorColor(_ color: UIColor?) {
    indicatorColor = color
    control.selectedSegmentTintColor = color
  }

  func setVerticalInset(_ inset: CGFloat) {
    guard inset != verticalInset else {
      return
    }
    verticalInset = inset
    setNeedsLayout()
  }

  func setContentPadding(x: CGFloat, y: CGFloat) {
    guard x != contentPaddingX || y != contentPaddingY else {
      return
    }
    contentPaddingX = x
    contentPaddingY = y
    rebuildSegments()
    setNeedsLayout()
  }

  // MARK: - Rendering

  private func rebuildSegments() {
    control.removeAllSegments()

    for (index, image) in makeSegmentImages(selecting: selectedIndex).enumerated() {
      control.insertSegment(with: image, at: index, animated: false)
    }

    guard control.numberOfSegments > 0 else {
      return
    }

    control.selectedSegmentIndex = max(0, min(selectedIndex, control.numberOfSegments - 1))
  }

  private func refreshSegmentImages() {
    guard control.numberOfSegments == items.count else {
      return
    }
    for (index, image) in makeSegmentImages(selecting: control.selectedSegmentIndex).enumerated() {
      control.setImage(image, forSegmentAt: index)
    }
  }

  /// Composes every segment in one pass so they can share a single glyph-box height.
  /// Trimming each symbol to its own ink leaves the boxes different heights, which would
  /// stagger the labels underneath them by a point or two each.
  private func makeSegmentImages(selecting selected: Int) -> [UIImage] {
    let configuration = UIImage.SymbolConfiguration(pointSize: iconSize, weight: iconWeight)
    let symbols = items.map { item in
      UIImage(systemName: item.systemImage, withConfiguration: configuration)
        .flatMap { Self.trimmingTransparentEdges($0) }
    }
    let glyphBoxHeight = symbols.compactMap { $0?.size.height }.max() ?? 0

    let images = items.enumerated().map { index, item in
      makeSegmentImage(
        for: item,
        symbol: symbols[index],
        glyphBoxHeight: glyphBoxHeight,
        selected: index == selected
      )
    }
    segmentWidth = images.map(\.size.width).max() ?? 0
    return images
  }

  /// Draws an SF Symbol with its label underneath into a single image.
  ///
  /// The renderer works in points at the screen's scale, so the resulting image reports the
  /// same point size we lay out here and `UISegmentedControl` renders it 1:1 without resampling.
  ///
  /// Both halves are measured by their *ink* rather than their typographic box: SF Symbol images
  /// carry several points of transparent margin, and a font's line box adds the gap between
  /// ascender and cap height on top. Laying out with those raw boxes pushes the icon and the
  /// label much further apart than `iconSpacing` claims, so the symbol is trimmed to its alpha
  /// bounds and the label is positioned from its cap height.
  private func makeSegmentImage(
    for item: SegmentItem,
    symbol trimmedSymbol: UIImage?,
    glyphBoxHeight: CGFloat,
    selected: Bool
  ) -> UIImage {
    let color = selected ? selectedContentColor : contentColor
    let symbol = trimmedSymbol?.withTintColor(color, renderingMode: .alwaysOriginal)

    let font = UIFont.systemFont(ofSize: fontSize, weight: fontWeight)
    let textAttributes: [NSAttributedString.Key: Any] = [
      .font: font,
      .foregroundColor: color
    ]
    let title = item.title as NSString
    let textSize = title.size(withAttributes: textAttributes)

    let symbolSize = symbol?.size ?? .zero
    let hasTitle = !item.title.isEmpty
    // Distance from the top of the line box down to the top of a capital letter.
    let capInset = font.ascender - font.capHeight
    let textInk = font.capHeight - font.descender

    let width = ceil(max(symbolSize.width, hasTitle ? textSize.width : 0)) + contentPaddingX * 2
    let height =
      ceil(glyphBoxHeight + (hasTitle ? iconSpacing + textInk : 0)) + contentPaddingY * 2

    guard width > 0, height > 0 else {
      return UIImage()
    }

    let renderer = UIGraphicsImageRenderer(size: CGSize(width: width, height: height))
    let image = renderer.image { _ in
      if let symbol {
        symbol.draw(
          in: CGRect(
            x: (width - symbolSize.width) / 2,
            y: contentPaddingY + (glyphBoxHeight - symbolSize.height) / 2,
            width: symbolSize.width,
            height: symbolSize.height
          )
        )
      }
      if hasTitle {
        title.draw(
          at: CGPoint(
            x: (width - textSize.width) / 2,
            y: contentPaddingY + glyphBoxHeight + iconSpacing - capInset
          ),
          withAttributes: textAttributes
        )
      }
    }

    return image.withRenderingMode(.alwaysOriginal)
  }

  /// Crops an image down to the bounding box of its non-transparent pixels.
  private static func trimmingTransparentEdges(_ image: UIImage) -> UIImage? {
    guard let source = image.cgImage else {
      return image
    }

    let width = source.width
    let height = source.height
    guard width > 0, height > 0 else {
      return image
    }

    var alpha = [UInt8](repeating: 0, count: width * height)
    let drawn: Bool = alpha.withUnsafeMutableBytes { buffer -> Bool in
      guard
        let baseAddress = buffer.baseAddress,
        let context = CGContext(
          data: baseAddress,
          width: width,
          height: height,
          bitsPerComponent: 8,
          bytesPerRow: width,
          space: CGColorSpaceCreateDeviceGray(),
          bitmapInfo: CGImageAlphaInfo.alphaOnly.rawValue
        )
      else {
        return false
      }
      context.draw(source, in: CGRect(x: 0, y: 0, width: width, height: height))
      return true
    }

    guard drawn else {
      return image
    }

    var minX = width, maxX = -1, minY = height, maxY = -1
    for y in 0..<height {
      let row = y * width
      for x in 0..<width where alpha[row + x] > 8 {
        if x < minX { minX = x }
        if x > maxX { maxX = x }
        if y < minY { minY = y }
        if y > maxY { maxY = y }
      }
    }

    guard maxX >= minX, maxY >= minY else {
      return image
    }

    let cropRect = CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
    guard let cropped = source.cropping(to: cropRect) else {
      return image
    }

    return UIImage(cgImage: cropped, scale: image.scale, orientation: image.imageOrientation)
      .withRenderingMode(image.renderingMode)
  }

  // MARK: - Events

  @objc
  private func handleTap(_ recognizer: UITapGestureRecognizer) {
    let count = control.numberOfSegments
    guard count > 0, control.bounds.width > 0 else {
      return
    }

    let width = control.bounds.width / CGFloat(count)
    let x = recognizer.location(in: control).x
    let index = max(0, min(count - 1, Int(x / width)))
    guard index != control.selectedSegmentIndex else {
      return
    }

    selectedIndex = index
    control.selectedSegmentIndex = index
    refreshSegmentImages()
    onSelect(["index": index])
  }

  // MARK: - Helpers

  private static func symbolWeight(from value: String) -> UIImage.SymbolWeight {
    switch value {
    case "ultraLight": return .ultraLight
    case "thin": return .thin
    case "light": return .light
    case "regular": return .regular
    case "medium": return .medium
    case "semibold": return .semibold
    case "bold": return .bold
    case "heavy": return .heavy
    case "black": return .black
    default: return .medium
    }
  }

  private static func fontWeight(from value: String) -> UIFont.Weight {
    switch value {
    case "ultraLight": return .ultraLight
    case "thin": return .thin
    case "light": return .light
    case "regular": return .regular
    case "medium": return .medium
    case "semibold": return .semibold
    case "bold": return .bold
    case "heavy": return .heavy
    case "black": return .black
    default: return .regular
    }
  }
}
