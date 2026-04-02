import type { RowDefinition } from "dnd-timeline";
import { useRow, useTimelineContext } from "dnd-timeline";
import { Film, Gauge, Layers, Music, Scissors, Sparkles, Type, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface RowProps extends RowDefinition {
	children: React.ReactNode;
	label?: string;
	hint?: string;
	isEmpty?: boolean;
	labelColor?: string;
}

const TRACK_ICONS: Record<string, React.ElementType> = {
	"row-main-video": Film,
	"row-zoom": ZoomIn,
	"row-trim": Scissors,
	"row-annotation": Type,
	"row-speed": Gauge,
	"row-audio": Music,
	"row-subtitle": Sparkles,
	"row-transition": Layers,
};

const TRACK_COLORS: Record<string, string> = {
	"row-main-video": "text-[#34B27B]",
	"row-zoom": "text-blue-400",
	"row-trim": "text-red-400",
	"row-annotation": "text-amber-400",
	"row-speed": "text-orange-400",
	"row-audio": "text-purple-400",
	"row-subtitle": "text-pink-400",
	"row-transition": "text-cyan-400",
};

export default function Row({ id, children, label, hint, isEmpty, labelColor = "#666" }: RowProps) {
	const { setNodeRef, rowWrapperStyle, rowStyle } = useRow({ id });
	const { sidebarWidth } = useTimelineContext();

	const Icon = TRACK_ICONS[id] || Layers;
	const iconColor = TRACK_COLORS[id] || "text-white/20";

	return (
		<div
			className="border-b border-white/[0.03] bg-[#0d0d0f] relative group/row transition-colors hover:bg-white/[0.02]"
			style={{ ...rowWrapperStyle, minHeight: 44, marginBottom: 0 }}
		>
			{/* Sidebar Label Area */}
			<div
				className="absolute left-0 top-0 bottom-0 border-r border-white/5 bg-black/40 z-20 flex items-center px-3 gap-2 select-none"
				style={{ width: sidebarWidth }}
			>
				<div className={cn("p-1 rounded bg-white/5", iconColor)}>
					<Icon size={12} />
				</div>
				<div className="flex flex-col">
					<span className="text-[9px] font-bold uppercase tracking-wider text-white/40 leading-none">
						{label || id.replace("row-", "").replace("-", " ")}
					</span>
				</div>
			</div>

			{isEmpty && hint && (
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
					style={{ marginLeft: sidebarWidth }}
				>
					<span className="text-[10px] text-white/10 font-medium tracking-tight italic">
						{hint}
					</span>
				</div>
			)}

			<div
				ref={setNodeRef}
				style={{
					...rowStyle,
					marginLeft: sidebarWidth,
				}}
				className="relative"
			>
				{/* Subtle grid lines for the track area */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[length:100px_100%] pointer-events-none" />
				{children}
			</div>
		</div>
	);
}
