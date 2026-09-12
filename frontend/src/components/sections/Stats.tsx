import { PLATFORM_STATS, PlatformStat } from "@/data/stats";
import { Container } from "@/components/layout/Container";
import { CheckCircle2, TrendingUp, Users, Trophy, Code2 } from "lucide-react";

export function Stats() {
  const iconMap: Record<string, typeof CheckCircle2> = {
    "problems-solved": CheckCircle2,
    "active-developers": Users,
    "weekly-contests": Trophy,
    "supported-languages": Code2,
  };

  const schemeStyles: Record<
    PlatformStat["colorScheme"],
    {
      iconBox: string;
      glow: string;
      badge: string;
      topBorder: string;
      numberGrad?: string;
    }
  > = {
    indigo: {
      iconBox: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      glow: "from-indigo-500/10 to-transparent",
      badge: "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/30",
      topBorder: "from-indigo-500 via-indigo-400 to-transparent",
    },
    cyan: {
      iconBox: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      glow: "from-cyan-500/10 to-transparent",
      badge: "text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-500/30",
      topBorder: "from-cyan-500 via-cyan-400 to-transparent",
    },
    amber: {
      iconBox: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      glow: "from-amber-500/10 to-transparent",
      badge: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30",
      topBorder: "from-amber-500 via-amber-400 to-transparent",
    },
    emerald: {
      iconBox: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      glow: "from-emerald-500/10 to-transparent",
      badge: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30",
      topBorder: "from-emerald-500 via-emerald-400 to-transparent",
    },
  };

  return (
    <section className="py-8 sm:py-14 border-y border-border-subtle bg-surface/30 relative">
      <Container size="xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {PLATFORM_STATS.map((stat) => {
            const Icon = iconMap[stat.id] || CheckCircle2;
            const style = schemeStyles[stat.colorScheme];

            return (
              <div
                key={stat.id}
                className="relative rounded-2xl bg-white dark:bg-[#0E121B] border border-border-subtle hover:border-border-strong p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                {/* Subtle top hairline accent */}
                <div
                  className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${style.topBorder} opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                {/* Subtle ambient corner light */}
                <div
                  className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${style.glow} blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* Top row: Icon and Trend badge */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${style.iconBox}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Trend badge: responsive text so it never breaks awkwardly on mobile */}
                    <div
                      className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 shadow-xs ${style.badge}`}
                    >
                      <TrendingUp className="w-3 h-3 shrink-0" />
                      <span className="xs:hidden">{stat.trendMicro}</span>
                      <span className="hidden xs:inline sm:hidden">{stat.trendShort}</span>
                      <span className="hidden sm:inline">{stat.trend}</span>
                    </div>
                  </div>

                  {/* Stat Number */}
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-primary font-mono mt-1 mb-0.5 sm:mb-1">
                    {stat.value}
                  </div>

                  {/* Stat Label */}
                  <div className="text-xs sm:text-sm font-semibold text-primary tracking-tight line-clamp-1">
                    {stat.label}
                  </div>
                </div>

                {/* Subtitle / Description */}
                <div className="text-[11px] sm:text-xs text-secondary mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border-subtle/80 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
