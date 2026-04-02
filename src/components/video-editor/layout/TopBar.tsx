import { ChevronDown, FolderOpen, Monitor, Save, Share } from "lucide-react";
import React from "react";
import { Tooltip } from "@/components/ui/tooltip";

interface TopBarProps {
	projectName: string;
	onSave: () => void;
	onExport: () => void;
	onLoad: () => void;
	isSaving?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
	projectName,
	onSave,
	onExport,
	onLoad,
	isSaving,
}) => {
	return (
		<div className="h-12 flex-shrink-0 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-[100] studio-glass">
			{/* macOS Traffic Lights (Aesthetic) */}
			<div className="flex items-center gap-2 w-48">
				<div className="flex gap-2 px-2">
					<div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 shadow-sm" />
					<div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 shadow-sm" />
					<div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 shadow-sm" />
				</div>

				<div className="h-4 w-[1px] bg-white/10 mx-2" />

				<div className="flex items-center gap-1 text-white/40">
					<Monitor size={14} />
					<span className="text-[10px] font-bold uppercase tracking-widest leading-none">
						Studio
					</span>
				</div>
			</div>

			{/* Project Title & Status */}
			<div className="flex flex-col items-center gap-0.5">
				<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
					<span className="text-[11px] font-semibold text-white/90 tracking-tight">
						{projectName || "Untitled Project"}
					</span>
					<ChevronDown
						size={12}
						className="text-white/30 group-hover:text-white/60 transition-colors"
					/>
				</div>
				{isSaving && (
					<span className="text-[8px] text-[#34B27B] font-medium animate-pulse uppercase tracking-tighter">
						Saving...
					</span>
				)}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-3 w-48 justify-end">
				<div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5">
					<Tooltip content="Open Project" side="bottom">
						<button
							onClick={onLoad}
							className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
						>
							<FolderOpen size={16} />
						</button>
					</Tooltip>

					<Tooltip content="Save Project" side="bottom">
						<button
							onClick={onSave}
							className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
						>
							<Save size={16} />
						</button>
					</Tooltip>
				</div>

				<button
					onClick={onExport}
					className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-gradient-to-r from-[#34B27B] to-[#2d9a6a] text-white text-[11px] font-bold shadow-lg shadow-[#34B27B]/10 hover:shadow-[#34B27B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
				>
					<Share size={14} />
					Export
				</button>
			</div>
		</div>
	);
};
