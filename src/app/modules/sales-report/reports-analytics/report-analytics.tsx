import { useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { Col, Row } from 'react-bootstrap';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { ReportTypes } from '../../../../utils/staticJSON';
import {
  Admin,
  BrandWiseSalesPerformanceReport,
  CategoryAndSubCategoryAnalysisReport,
  CustomerPurchaseBehaviourReport,
  FrequentCustomerPurchasePatternAnalysisReport,
  GeographicSalesInsightReport,
  InventoryStatusReport,
  ProductSalesPerformanceReport,
  RevenueGenerationReport,
} from '../../../../utils/constants';
import GeographicSalesInsight from './geograhicSalesInsight';
import FrequestCustomerPurchase from './frequentCustomerPurchase';
import ProductSalesPerformance from './productSalesPerformance';
import BrandWiseSales from './brandWiseSales';
import CategorySubCategory from './categorySubCategory';
import RevenueGenerationReports from './revenueGenerationReport';
import ProductVariantReport from './productVariantReport';
import PurchaseBehaviourReport from './purchaseBehaviourReport';
const ReportsAndAnalytics = () => {
  const { currentUser } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState<any>();
  const [reportTypes, setReportTypes] = useState<any>([]);
  useEffect(() => {
    //  const hasAllModules = currentUser?.roleAndPermission.permissions.some(
    //    (item: any) => item.module === AllModules
    //  );
    if (currentUser?.userType == Admin) {
      setReportTypes(ReportTypes);
      setSelectedReportType(ReportTypes[0]);
    } else {
      let permissions: any = [];
      currentUser?.roleAndPermission.permissions.map((item: any) =>
        permissions.push(item.module)
      );
      let filtered: any = [];
      ReportTypes.map((val) => {
        if (permissions.includes(val.value)) {
          filtered.push(val);
        }
      });
      setSelectedReportType(filtered[0]);
      setReportTypes(filtered);
    }
  }, []);
  const handleSelectReport = async (event: any) => {
    setSelectedReportType(event);
  };
  const renderReportComponent = () => {
    switch (selectedReportType?.value) {
      case GeographicSalesInsightReport:
        return <GeographicSalesInsight />;
      //   case AreaBasedCustomerSegmentationReport:
      //     return <AreaBasedCustomers />;
      case FrequentCustomerPurchasePatternAnalysisReport:
        return <FrequestCustomerPurchase />;
      case ProductSalesPerformanceReport:
        return <ProductSalesPerformance />;
      case BrandWiseSalesPerformanceReport:
        return <BrandWiseSales />;
      case CategoryAndSubCategoryAnalysisReport:
        return <CategorySubCategory />;
      case RevenueGenerationReport:
        return <RevenueGenerationReports />;
      case InventoryStatusReport:
        return <ProductVariantReport />;
      case CustomerPurchaseBehaviourReport:
        return <PurchaseBehaviourReport />;
    }
  };
  return (
    <>
      <div className="p-2">
        <Row className="mb-4">
          <Col
            lg={4}
            m={4}
            xs={12}
          >
            <CustomSelectWhite
              options={reportTypes}
              onChange={(event: any) => handleSelectReport(event)}
              value={selectedReportType}
              placeholder="Select"
            />
          </Col>
        </Row>
        {renderReportComponent()}
      </div>
    </>
  );
};
export default ReportsAndAnalytics;
