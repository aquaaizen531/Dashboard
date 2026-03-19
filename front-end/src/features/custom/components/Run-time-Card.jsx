import { Card } from "@/components/ui/card";

const RuntimeCard = ({ operators }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {operators.map((operator, idx) => (
          <div key={idx} className="flex justify-between text-xs border-b pb-1">
            <div>
              <h4 className="text-xs font-semibold mb-2">Date</h4>
              <span>
                {new Date(operator.date).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Runtime</h4>
              <span className="font-medium">{Math.floor(operator.runtime / 3600)} h</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Operator</h4>
              <span>{operator.user?.name ? operator.user?.name : "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RuntimeCard;
