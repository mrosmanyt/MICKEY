import { Camera, MonitorUp, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useVisionStore } from "@/store/useVisionStore";
import { cn } from "@/lib/utils";

/** Camera / Screen vision toggle button with active state. */
function VisionToggle({ kind }: { kind: "camera" | "screen" }) {
  const mode = useVisionStore((s) => s.mode);
  const enableCamera = useVisionStore((s) => s.enableCamera);
  const enableScreen = useVisionStore((s) => s.enableScreen);
  const disable = useVisionStore((s) => s.disable);

  const active = mode === kind;
  const Icon = kind === "camera" ? Camera : MonitorUp;

  const toggle = () => {
    if (active) disable();
    else if (kind === "camera") void enableCamera().catch(() => undefined);
    else void enableScreen().catch(() => undefined);
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "glass flex size-8 items-center justify-center transition-colors",
        active ? "text-neon shadow-[0_0_12px_rgba(var(--glow),0.4)]" : "text-neon-dim hover:text-neon",
      )}
      aria-label={kind === "camera" ? "Toggle camera" : "Toggle screen share"}
      title={kind === "camera" ? "Enable Camera" : "Share Screen"}
    >
      <Icon className="size-4" />
    </button>
  );
}

/** Top bar: angular MICKEY title plate (center) + utility icons (right). */
export default function TopBar() {
  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between px-5">
      {/* Left: version tag */}
      <div className="flex items-center gap-2 font-display text-[0.65rem] tracking-[0.25em] text-neon-dim">
        <span className="size-1.5 rounded-full bg-neon dot-active" />
        MICKEY&nbsp;CORE&nbsp;v0.1
      </div>

      {/* Center: title plate with angled wings */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 top-2 -translate-x-1/2"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-24 bg-gradient-to-l from-neon/70 to-transparent" />
          <div
            className="border border-neon/40 bg-panel/80 px-10 py-2 backdrop-blur"
            style={{
              clipPath:
                "polygon(16px 0, calc(100% - 16px) 0, 100% 100%, 0 100%)",
            }}
          >
            <h1 className="neon-text font-display text-xl font-black tracking-[0.45em]">
              MICKEY
            </h1>
          </div>
          <span className="h-px w-24 bg-gradient-to-r from-neon/70 to-transparent" />
        </div>
        <p className="mt-1 text-center text-[0.6rem] tracking-[0.3em] text-neon-dim/80 uppercase">
          Personal Intelligent Cyber Assistant
        </p>
      </motion.div>

      {/* Right: vision controls + settings */}
      <div className="flex items-center gap-1.5">
        <VisionToggle kind="camera" />
        <VisionToggle kind="screen" />
        <button
          onClick={() => useSettingsStore.getState().setOpen(true)}
          className="glass flex size-8 items-center justify-center text-neon-dim transition-colors hover:rotate-45 hover:text-neon"
          aria-label="Open settings"
          title="Settings"
        >
          <Settings className="size-4" />
        </button>
      </div>
    </header>
  );
}
