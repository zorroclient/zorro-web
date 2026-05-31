import { cn } from "@/lib/utils";

const tabs = ["All", "Combat", "Movement", "Visual", "World", "Other"];

const modules = [
    { name: "Aim Assist", key: "R", on: true, selected: true },
    { name: "Kill Aura", on: false },
    { name: "Reach", on: true },
    { name: "Autoclicker", on: true },
    { name: "Right Clicker", on: false },
    { name: "Velocity", on: false },
    { name: "Flight", on: false },
    { name: "Keep Sprint", on: true },
    { name: "ESP", key: "X", on: false },
    { name: "Tracers", key: "G", on: false },
    { name: "Fullbright", on: false },
];

const quickToggles = [
    [
        { label: "Target Players", on: true },
        { label: "Target Passive", on: false },
        { label: "Filter Teammates", on: true },
        { label: "Ignore Dead", on: true },
    ],
    [
        { label: "Target Hostile", on: false },
        { label: "Target Locking", on: true },
        { label: "Ignore Invisible", on: true },
        { label: "Behind Wall Check", on: true },
    ],
];

const sliders = [
    { label: "FOV", value: "155.08", pct: 52 },
    { label: "Range", value: "10.57", pct: 88 },
    { label: "Speed", value: "45.31", pct: 38 },
    { label: "Switch Resistance %", value: "25%", pct: 25 },
];

function Check({ on, className }: { on: boolean; className?: string }) {
    return (
        <span
            className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-white/15",
                on ? "bg-white/5" : "border bg-white/5",
                className,
            )}
        >
            {on && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-[#3fb950]">
                    <path
                        d="M2.5 6.2l2.2 2.2L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </span>
    );
}

export function ZorroMockup() {
    return (
        <div className="select-none relative w-full animate-float">
            <div
                aria-hidden
                className="absolute -inset-8 -z-10 rounded-[1rem] bg-[radial-gradient(50%_50%_at_60%_40%,rgb(255_122_24/0.28),transparent)] blur-2xl animate-glow"
            />
            <div className="overflow-hidden rounded-md border border-white/10 bg-[#0f1216] font-sans text-[11px] text-white/90 shadow-2xl ring-1 ring-white/5">
                {/* toolbar */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2 py-2 text-[10px]">
                    <div className="flex items-center gap-2">
                        {/* <span className="rounded bg-white/10 px-2 py-1 text-white/70">
                            Back
                        </span> */}
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                            <span className="font-medium">Cosmic Client</span>
                            <span className="text-white/40">(PID 45484)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check on />
                            Auto-Inject
                        </span>
                    </div>
                    <div className="hidden items-center gap-2 text-white/40 sm:flex">
                        <span>Version: 1.3.3.7</span>
                        <span className="rounded bg-white/10 px-2 py-1 text-white/70">
                            Eject DLL
                        </span>
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-red-500/20 text-red-500">
                            ⏻
                        </span>
                    </div>
                </div>

                {/* category tabs */}
                <div className="flex justify-between items-center gap-2 border-b border-white/10 px-2 py-2">
                    {tabs.map((t, i) => (
                        <span
                            key={t}
                            className={cn(
                                "rounded px-2.5 py-1 text-[10px] w-full text-center",
                                i === 0
                                    ? "bg-brand font-semibold text-white"
                                    : "text-white/55 bg-accent-foreground/10",
                            )}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                {/* body */}
                <div className="flex">
                    {/* sidebar */}
                    <div className="w-[25%] shrink-0 border-r border-white/10">
                        {modules.map((m) => (
                            <div
                                key={m.name}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.75",
                                    m.selected && "bg-brand/15",
                                )}
                            >
                                <Check on={m.on} />
                                <span
                                    className={cn(
                                        "truncate",
                                        m.selected
                                            ? "text-brand"
                                            : "text-white/80",
                                    )}
                                >
                                    {m.name}
                                </span>
                                {m.key && (
                                    <span className="ml-auto text-[9px] text-white/35">
                                        [{m.key}]
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* detail panel */}
                    <div className="flex-1 space-y-3 p-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium">
                                        Aim Assist
                                    </span>
                                    <span className="text-[9px] text-white/40">
                                        (Combat)
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[10px] text-white/45">
                                    Smoothly rotates view towards targets
                                </p>
                            </div>
                        </div>

                        {/* quick toggles */}
                        <div className="rounded-md border border-white/10 p-2.5">
                            <div className="mb-2 text-[10px] font-medium text-white/70">
                                Quick Toggles
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                {quickToggles.flat().map((q) => (
                                    <span
                                        key={q.label}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check on={q.on} />
                                        <span className="truncate text-[10px] text-white/70">
                                            {q.label}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* tuning */}
                        <div className="rounded-md border border-white/10 p-2.5">
                            <div className="mb-2 text-[10px] font-medium text-white/70">
                                Tuning
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                                {sliders.map((s) => (
                                    <div key={s.label}>
                                        <div className="mb-1 text-[9px] text-white/45">
                                            {s.label}
                                        </div>
                                        <div className="relative h-4 overflow-hidden rounded border border-white/10 bg-white/5">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-brand/25"
                                                style={{ width: `${s.pct}%` }}
                                            />
                                            <span
                                                className="absolute top-1/2 h-3 w-1.5 -translate-y-1/2 rounded-sm bg-brand"
                                                style={{
                                                    left: `calc(${s.pct}% - 3px)`,
                                                }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/70">
                                                {s.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
