import { Card } from "@/components/ui/card";

const TempHumidityCard = ({ data }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {data.map((data, idx) => (
          <div key={idx} className="flex justify-between text-xs border-b pb-1">
            <div>
              <h4 className="text-xs font-semibold mb-2">Run History</h4>
              <span>{data.humidity + "%"}</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Temperature</h4>
              <span className="font-medium">{data.temperature}°C</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Tide</h4>
              <span>{data.tide ? data.tide : "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TempHumidityCard;
