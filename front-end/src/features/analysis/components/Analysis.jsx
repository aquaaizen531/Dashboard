import { AnalysisTable } from "./analysis-data-table";
import { analysisColumns } from "../analysis-Colum-def";

const Analysis = () => {
  return (
    <div className="m-2">
      <AnalysisTable columns={analysisColumns} />
    </div>
  );
};

export default Analysis;
