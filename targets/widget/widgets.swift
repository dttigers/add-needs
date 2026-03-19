import WidgetKit
import SwiftUI

// MARK: - Timeline Entry

struct QuickLaunchEntry: TimelineEntry {
    let date: Date
}

// MARK: - Timeline Provider

struct QuickLaunchProvider: TimelineProvider {
    func placeholder(in context: Context) -> QuickLaunchEntry {
        QuickLaunchEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (QuickLaunchEntry) -> Void) {
        completion(QuickLaunchEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuickLaunchEntry>) -> Void) {
        let entry = QuickLaunchEntry(date: Date())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
}

// MARK: - Widget View

struct QuickLaunchWidgetView: View {
    @Environment(\.widgetFamily) var widgetFamily
    var entry: QuickLaunchProvider.Entry

    var body: some View {
        switch widgetFamily {
        case .accessoryCircular:
            lockScreenView
        default:
            homeScreenView
        }
    }

    // Home screen small widget
    private var homeScreenView: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("🧠")
                .font(.system(size: 32))
            Spacer()
            Text("ADHD Needs")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Color("AccentColor"))
            Text("What do I need?")
                .font(.system(size: 11))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding()
        .containerBackground(Color("WidgetBackground"), for: .widget)
        .widgetURL(URL(string: "adhdneeds://"))
    }

    // Lock screen circular widget
    private var lockScreenView: some View {
        ZStack {
            AccessoryWidgetBackground()
            Text("🧠")
                .font(.system(size: 24))
        }
        .widgetURL(URL(string: "adhdneeds://"))
    }
}

// MARK: - Widget Configuration

struct QuickLaunchWidget: Widget {
    let kind: String = "QuickLaunchWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: QuickLaunchProvider()) { entry in
            QuickLaunchWidgetView(entry: entry)
        }
        .configurationDisplayName("ADHD Needs")
        .description("Quickly identify what you really need right now.")
        .supportedFamilies([.systemSmall, .accessoryCircular])
    }
}

// MARK: - Preview

#Preview(as: .systemSmall) {
    QuickLaunchWidget()
} timeline: {
    QuickLaunchEntry(date: .now)
}
