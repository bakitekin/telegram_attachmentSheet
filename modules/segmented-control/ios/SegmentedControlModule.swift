import ExpoModulesCore

public final class SegmentedControlModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SegmentedControl")

    View(SegmentedControlView.self) {
      Events("onSelect")

      Prop("segments") { (view: SegmentedControlView, segments: [SegmentItem]) in
        view.setSegments(segments)
      }

      Prop("selectedIndex") { (view: SegmentedControlView, index: Int) in
        view.setSelectedIndex(index)
      }

      Prop("selectedContentColor") { (view: SegmentedControlView, color: UIColor?) in
        view.setSelectedContentColor(color)
      }

      Prop("contentColor") { (view: SegmentedControlView, color: UIColor?) in
        view.setContentColor(color)
      }

      Prop("iconSize") { (view: SegmentedControlView, size: CGFloat?) in
        view.setIconSize(size ?? 24)
      }

      Prop("fontSize") { (view: SegmentedControlView, size: CGFloat?) in
        view.setFontSize(size ?? 11)
      }

      Prop("iconSpacing") { (view: SegmentedControlView, spacing: CGFloat?) in
        view.setIconSpacing(spacing ?? 3)
      }

      Prop("iconWeight") { (view: SegmentedControlView, weight: String?) in
        view.setIconWeight(weight ?? "medium")
      }

      Prop("fontWeight") { (view: SegmentedControlView, weight: String?) in
        view.setFontWeight(weight ?? "regular")
      }

      Prop("contentPadding") { (view: SegmentedControlView, padding: ContentPadding?) in
        view.setContentPadding(x: padding?.horizontal ?? 0, y: padding?.vertical ?? 0)
      }

      Prop("verticalInset") { (view: SegmentedControlView, inset: CGFloat?) in
        view.setVerticalInset(inset ?? 0)
      }

      Prop("indicatorColor") { (view: SegmentedControlView, color: UIColor?) in
        view.setIndicatorColor(color)
      }
    }
  }
}
