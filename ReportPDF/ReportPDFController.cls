public class ReportPDFController {

    public List<String> getReportHeaders() {
        Id reportId = ApexPages.currentPage().getParameters().get('reportId');
        Reports.ReportDescribeResult reportMd = Reports.ReportManager.describeReport(reportId);
        List<String> header = new List<String>();
        // Grouping Header
        for(Reports.GroupingInfo column:reportMd.getReportMetadata().getGroupingsDown()) {
            header.add(reportMd.getReportExtendedMetadata().getGroupingColumnInfo().get(column.getName()).getLabel());
        }
        for(Reports.GroupingInfo column:reportMd.getReportMetadata().getGroupingsAcross()) {
            header.add(reportMd.getReportExtendedMetadata().getGroupingColumnInfo().get(column.getName()).getLabel());
        }
        // Aggregates Header
        for(String column:reportMd.getReportMetadata().getAggregates()) {
            header.add(reportMd.getReportExtendedMetadata().getAggregateColumnInfo().get(column).getLabel());
        }
        return header;
    }
    
    public List<List<String>> getReportRows() {
        Id reportId = ApexPages.currentPage().getParameters().get('reportId');
        Reports.ReportResults result = Reports.ReportManager.runReport(reportId);
        LabelVisitor v = new LabelVisitor(result);
        ReportResultsTraversor t = new ReportResultsTraversor(result, v);
        t.process();
		return v.getRows();
    }
    
    private class LabelVisitor implements ReportResultsVisitor {
        Reports.ReportResults result = null;
        List<List<String>> rows = new List<List<String>>();
        
        LabelVisitor(Reports.ReportResults result) {
            this.result = result;
        }
        
        public void processSummary(List<Reports.GroupingValue> down, List<Reports.GroupingValue> across, Reports.ReportFact fact) {
            List<String> row = new List<String>();
            if(null != down) {
                for(Reports.GroupingValue g:down) {
                    row.add(g.getLabel());
                }
                for(Integer i=0;i<result.getReportMetadata().getGroupingsDown().size() - down.size();i++) {
                	row.add('----------');
            	}
            }
            for(Reports.SummaryValue agg: fact.getAggregates()) {
                row.add(agg.getLabel());
            }
            rows.add(row);
        }
        
        List<List<String>> getRows() {
            return rows;
        }
    }
}