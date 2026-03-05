import { AnalysisTable } from "./components/analysis-data-table";
import { analysisColumns } from "./components/analysis-Colum-def";

const Analysis = () => {
  return (
    <div className="m-2">
      <AnalysisTable columns={analysisColumns} />
    </div>
  );
};

export default Analysis;
