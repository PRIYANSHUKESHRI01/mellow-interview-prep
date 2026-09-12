import { DEMO_USER_STATS, DEMO_RATING_HISTORY } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Award } from "lucide-react";

export function RatingCard() {
  const minRating = 1450;
  const maxRating = 1900;
  const width = 360;
  const height = 110;

  // Generate SVG points for the rating history
  const points = DEMO_RATING_HISTORY.map((item, idx) => {
    const x = (idx / (DEMO_RATING_HISTORY.length - 1)) * (width - 40) + 20;
    const y = height - ((item.rating - minRating) / (maxRating - minRating)) * (height - 30) - 15;
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <Card variant="default" className="p-6 border-border-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
            <Award className="w-4 h-4 text-accent-primary" />
            <span>Contest Rating</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +332 pts this season
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl sm:text-4xl font-black font-mono text-primary">
            {DEMO_USER_STATS.rating}
          </span>
          <span className="text-xs font-mono text-text-muted">
            Rank: <strong className="text-primary font-bold">#{DEMO_USER_STATS.contestRank}</strong> (Top 4.8%)
          </span>
        </div>
        <p className="text-xs text-text-secondary">Official CodeForge Division 1 Competitor</p>
      </div>

      {/* SVG Sparkline Chart */}
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-24 overflow-visible"
            aria-label="Rating progression chart"
          >
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient area */}
            <path d={areaD} fill="url(#ratingGradient)" />

            {/* Main line */}
            <path
              d={pathD}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data point dots */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={i === points.length - 1 ? "4.5" : "3"}
                  className={i === points.length - 1 ? "fill-accent-primary stroke-white stroke-2" : "fill-accent-primary"}
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-text-muted mt-2">
          <span>Jul 1 (1,510)</span>
          <span>Aug 1 (1,640)</span>
          <span className="text-accent-primary font-bold">Sep 11 (1,842)</span>
        </div>
      </div>
    </Card>
  );
}
