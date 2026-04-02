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
	const eyeActiveTimer = useRef<number>(0);

	const [isEyeActive, setIsEyeActive] = useState(false);
	const [isBlastActive, setIsBlastActive] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		const type = params.get("windowType") ?? "";

		setWindowType(type);

		// Pre-load the Eye Image

		const img = new Image();

		img.src = "/logo.png";

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

		const text = `Welcome to the Openscreen development environment.\nA powerful, open-source screen recorder and editor.\nBuilt for creating clean walkthroughs and video demos.\nNo subscriptions, no watermarks, no hidden limits.\nWe focus strictly on the core video creation tools.\nScreen capture, timeline editing, and zoom effects.\nEverything runs smoothly with pure local performance.\nThis interface exists solely for testing and iteration.\nBuild new features without affecting the production build.\npov: openscreen dev mode is currently active.`;

		const font = "800 18px Inter, system-ui, sans-serif";

		ctx.font = font;

		const prepared = prepareWithSegments(text, font);

		const { lines } = layoutWithLines(prepared, 650, 32);

		interface CharPoint {
			char: string;

			baseX: number;

			baseY: number;

			x: number;

			y: number;

			vx: number;

			vy: number;

			phase: number; // For breathing animation
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

				chars.push({
					char,

					baseX: bx,

					baseY: by,

					x: bx,

					y: by,

					vx: 0,

					vy: 0,

					phase: Math.random() * Math.PI * 2, // Random starting phase
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

			const isMoving = Math.abs(mouse.current.x - mouse.current.lastX) > 1.0;

			// Eye appears after 3s of hovering near center
			if (distToCenter < 80 && !isMoving) {
				stopTimer.current += dt;

				if (stopTimer.current > 3000) {
					setIsEyeActive(true);
				}
			} else {
				// Only reset if eye hasn't appeared yet
				if (!isEyeActive) {
					stopTimer.current = 0;
				}
			}

			// Once eye is active, start counting for blast
			if (isEyeActive) {
				eyeActiveTimer.current += dt;
				if (eyeActiveTimer.current > 5000) {
					setIsBlastActive(true);
				}
			} else {
				eyeActiveTimer.current = 0;
				setIsBlastActive(false);
			}

			// Draw the text

			ctx.font = font;

			chars.forEach((c) => {
				// 1. Constant "Breathing" effect (text is alive)

				const breath = Math.sin(time * 0.002 + c.phase) * 1.5;

				c.baseY += breath * 0.05; // slowly shifts the baseline

				const dx = mouse.current.x - c.x;

				const dy = mouse.current.y - c.y;

				const dist = Math.sqrt(dx * dx + dy * dy);

				// 2. The "Cero Blast" (Eye opens, text flies away) - ONLY after 5s
				if (isBlastActive) {
					const blastDx = centerPoint.x - c.x;

					const blastDy = centerPoint.y - c.y;

					const blastDist = Math.sqrt(blastDx * blastDx + blastDy * blastDy);

					if (blastDist < 250) {
						const blastAngle = Math.atan2(blastDy, blastDx);

						// Massive negative force to push away from center

						c.vx -= Math.cos(blastAngle) * 10;

						c.vy -= Math.sin(blastAngle) * 10;
					}
				}
				// 3. Magnetic Hover Wave - only when eye is NOT active
				else if (!isEyeActive && dist < 150) {
					const angle = Math.atan2(dy, dx);

					const force = (150 - dist) / 150;

					// Repulsion + Swirl effect

					c.vx -= Math.cos(angle) * force * 2.5;

					c.vy -= Math.sin(angle) * force * 2.5;

					// Add a perpendicular force for a "swirl/wave" feeling

					c.vx -= Math.sin(angle) * force * 1.5;

					c.vy += Math.cos(angle) * force * 1.5;
				}

				// Physics: Friction + Spring

				c.vx *= 0.88; // Slightly lower friction for smoother waves

				c.vy *= 0.88;

				c.x += c.vx + (c.baseX - c.x) * 0.1;

				c.y += c.vy + (c.baseY - c.y) * 0.1;

				// Dynamic coloring and glowing based on speed/distance

				const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);

				if (isBlastActive) {
					ctx.fillStyle = "#5252cbff"; // Dark blue when blasted

					ctx.shadowColor = "#5454c3ff";

					ctx.shadowBlur = 10;
				} else if (!isEyeActive && dist < 150) {
					ctx.fillStyle = "#16a34a"; // Bright green wave when hovered

					ctx.shadowColor = "#16a34a";

					ctx.shadowBlur = speed * 2; // Glows brighter the faster it moves
				} else {
					ctx.fillStyle = "#aeaecaff"; // Default dark text

					ctx.shadowBlur = 0;
				}

				ctx.fillText(c.char, c.x, c.y);
			});

			// 4. Draw the Eye with a pulsing glow
			if (isEyeActive && eyeRef.current) {
				// 1. SET THE TARGET HEIGHT (This keeps it from being too big on the screen)
				const targetHeight = 80;

				// 2. GET THE LOGO'S ORIGINAL SHAPE (Aspect Ratio)
				const logoRatio = eyeRef.current.naturalWidth / eyeRef.current.naturalHeight;

				// 3. CALCULATE WIDTH BASED ON RATIO
				const eyeH = targetHeight;
				const eyeW = targetHeight * logoRatio;

				// 4. PROPORTIONAL PULSE (So it doesn't distort while pulsing)
				const pulse = Math.sin(time * 0.005) * 5;
				const finalW = eyeW + pulse * logoRatio;
				const finalH = eyeH + pulse;

				ctx.save();

				// Smooth fade in
				const fade = Math.min(1, (stopTimer.current - 3000) / 400);
				ctx.globalAlpha = fade;

				// Glow matches the state (Green or Blue blast)
				ctx.shadowColor = isBlastActive ? "#5252cb" : "#16a34a";
				ctx.shadowBlur = 25 + pulse;

				// 5. DRAW PERFECTLY CENTERED
				ctx.drawImage(
					eyeRef.current,
					centerPoint.x - finalW / 2,
					centerPoint.y - finalH / 2,
					finalW,
					finalH,
				);

				ctx.restore();
			}

			frame = requestAnimationFrame(render);
		};

		frame = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(frame);

			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [windowType, isEyeActive, isBlastActive]);

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
			<div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center flex-col overflow-hidden select-none">
				<div className="text-center z-10 mb-6">
					<h1
						className="text-4xl font-bold text-white mb-1 tracking-tight"
						style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
					>
						Openscreen
					</h1>

					<p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-green-500/70">
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
