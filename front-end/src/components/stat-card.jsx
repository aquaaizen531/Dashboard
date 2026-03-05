import { Card } from "@/components/ui/card";

const StatCard = (stat) => {
  const Icon = stat.icon;
  const isPositive = stat.change && stat.change.startsWith("+");
  const isNeutral = stat.change && stat.change === "0.0%";
  return (
    <Card className="p-4 sm:p-5 h-[175px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">
            {stat.title}
          </p>
          <p className="mt-2  font-bold tracking-tight text-md lg:text-xl">
            {stat.value}
          </p>
          {stat.change && (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`font-medium ${
                  isPositive
                    ? "text-emerald-600"
                    : isNeutral
                      ? "text-muted-foreground"
                      : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.period}</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-1 sm:p-1.5 ${stat.iconBg}`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
        </div>
      </div>
    </Card>
  );
};
export default StatCard;
