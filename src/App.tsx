import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useRef, useState } from "react";
import { LaunchWindow } from "./components/launch/LaunchWindow";
import { SourceSelector } from "./components/launch/SourceSelector";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ShortcutsConfigDialog } from "./components/video-editor/ShortcutsConfigDialog";
import VideoEditor from "./components/video-editor/VideoEditor";
import { ShortcutsProvider } from "./contexts/ShortcutsContext";
import { loadAllCustomFonts } from "./lib/customFonts";

export default function App() {
	const [windowType, setWindowType] = useState("");
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouse = useRef({ x: -1000, y: -1000, lastX: -1000, lastY: -1000 });
	const eyeRef = useRef<HTMLImageElement | null>(null);
	const stopTimer = useRef<number>(0);
	const [isEyeActive, setIsEyeActive] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const type = params.get("windowType") ?? "";
		setWindowType(type);

		// Pre-load the Eye Image
		const img = new Image();
		img.src = "https://www.pngkey.com/png/full/13-138263_anime-eye-png-cool-anime-eyes-png.png";
		img.onload = () => {
			eyeRef.current = img;
		};

		if (["hud-overlay", "source-selector"].includes(type)) {
			document.body.style.background = "transparent";
			document.documentElement.style.background = "transparent";
			document.getElementById("root")?.style.setProperty("background", "transparent");
		}

		loadAllCustomFonts().catch(console.error);
	}, []);

	useEffect(() => {
		if (windowType !== "" || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const text = `For years, frontend had a hidden bottleneck.\nText layout.\nWe relied on the DOM to measure everything.\nWhich means… reflows, delays, and guesswork.\nPretext changes that.\nIt calculates text layout BEFORE rendering.\nNo DOM. No reflow. Just pure math.\nThis isn’t just a library.\nIt fixes something we thought was unsolvable.\npov: this new frontend library is INSANE.`;

		const font = "600 18px Inter, system-ui, sans-serif";
		ctx.font = font;

		const prepared = prepareWithSegments(text, font);
		const { lines } = layoutWithLines(prepared, 600, 28);

		interface CharPoint {
			char: string;
			baseX: number;
			baseY: number;
			x: number;
			y: number;
			vx: number;
			vy: number;
			speedFactor: number;
			visible: boolean;
			isCenter: boolean;
		}

		let chars: CharPoint[] = [];
		let startY = 80;
		const centerPoint = { x: canvas.width / 2, y: startY + (lines.length * 32) / 2 };

		interface TextLine {
			text: string;
		}

		(lines as TextLine[]).forEach((line, lineIdx) => {
			const lineWidth = ctx.measureText(line.text).width;
			let currentX = (canvas.width - lineWidth) / 2;

			line.text.split("").forEach((char: string) => {
				const bx = currentX;
				const by = startY + lineIdx * 32;
				// Calculate distance to center to find which chars to hide
				const distToCenter = Math.sqrt(
					Math.pow(bx - centerPoint.x, 2) + Math.pow(by - centerPoint.y, 2),
				);

				chars.push({
					char,
					baseX: bx,
					baseY: by,
					x: bx,
					y: by,
					vx: 0,
					vy: 0,
					isCenter: distToCenter < 40,
					speedFactor: 1.0,
					visible: true,
				});
				currentX += ctx.measureText(char).width;
			});
		});

		const onMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			mouse.current.lastX = mouse.current.x;
			mouse.current.lastY = mouse.current.y;
			mouse.current.x = e.clientX - rect.left;
			mouse.current.y = e.clientY - rect.top;
		};

		window.addEventListener("mousemove", onMouseMove);

		let frame: number;
		let lastTime = performance.now();

		const render = (time: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const dt = time - lastTime;
			lastTime = time;

			// --- STOP DETECTION LOGIC ---
			const distToCenter = Math.sqrt(
				Math.pow(mouse.current.x - centerPoint.x, 2) + Math.pow(mouse.current.y - centerPoint.y, 2),
			);
			const isMoving = Math.abs(mouse.current.x - mouse.current.lastX) > 0.5;

			if (distToCenter < 60 && !isMoving) {
				stopTimer.current += dt;
				if (stopTimer.current > 3000) setIsEyeActive(true);
			} else {
				stopTimer.current = 0;
				setIsEyeActive(false);
			}

			chars.forEach((c) => {
				const dx = mouse.current.x - c.x;
				const dy = mouse.current.y - c.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 100) {
					const angle = Math.atan2(dy, dx);
					const force = (100 - dist) / 100;
					c.vx -= Math.cos(angle) * force * 1.8;
					c.vy -= Math.sin(angle) * force * 1.8;
				}

				c.vx *= 0.91;
				c.vy *= 0.91;
				c.x += c.vx + (c.baseX - c.x) * 0.16;
				c.y += c.vy + (c.baseY - c.y) * 0.16;

				// Draw logic: hide center chars if eye is active
				if (!(isEyeActive && c.isCenter)) {
					ctx.fillStyle = dist < 100 ? "#171761" : "#440a0a";
					ctx.fillText(c.char, c.x, c.y);
				}
			});

			// Draw the Eye
			if (isEyeActive && eyeRef.current) {
				const eyeW = 120;
				const eyeH = 60;
				ctx.save();
				ctx.globalAlpha = Math.min(1, (stopTimer.current - 3000) / 500); // Fade in
				ctx.drawImage(eyeRef.current, centerPoint.x - eyeW / 2, centerPoint.y - eyeH, eyeW, eyeH);
				ctx.restore();
			}

			frame = requestAnimationFrame(render);
		};

		frame = requestAnimationFrame(render);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [windowType, isEyeActive]);

	const renderContent = () => {
		if (windowType === "hud-overlay") return <LaunchWindow />;
		if (windowType === "source-selector") return <SourceSelector />;
		if (windowType === "editor")
			return (
				<ShortcutsProvider>
					<VideoEditor />
					<ShortcutsConfigDialog />
				</ShortcutsProvider>
			);

		return (
			<div className="w-full h-full bg-background flex items-center justify-center flex-col overflow-hidden select-none">
				<div className="text-center z-10 mb-6">
					<h1 className="text-4xl font-bold text-[#1f1f26] mb-1 tracking-tight">Openscreen</h1>
					<p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-indigo-600/50">
						Development Environment
					</p>
				</div>
				<canvas ref={canvasRef} width={800} height={500} className="max-w-full" />
			</div>
		);
	};

	return (
		<TooltipProvider>
			{renderContent()}
			<Toaster theme="dark" className="pointer-events-auto" />
		</TooltipProvider>
	);
}
