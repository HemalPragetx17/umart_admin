import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../../Global/loader';
import Method from '../../../../utils/methods';
import { Product, Units } from '../../../../utils/constants';
import clsx from 'clsx';
import APICallService from '../../../../api/apiCallService';
import { inventory } from '../../../../api/apiEndPoints';
const ProductStockDetails = (props: any) => {
  const [fetchLoader, setFetchLoader] = useState(true);
  const [stock, setStock] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchDetails();
      setFetchLoader(false);
    })();
  }, []);
  const fetchDetails = async () => {
    let apiService = new APICallService(
      inventory.variantStockList,
      props.productDetails._id,
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response.records.length) {
      setStock(response.records);
    }
  };
  const checkIsValidBatch = (expiryDateStr: any, daysToAdd: number) => {
    if (!expiryDateStr) return true;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);
    const expiryDate = new Date(expiryDateStr);
    return futureDate < expiryDate;
  };
  return (
    <>
      {fetchLoader ? (
        <>
          <Row>
            <Col xs={12}>
              <Card className="border border-r10px">
                <Card.Body className="p-0 ">
                  <Row className="align-items-center h-250px">
                    <div className="d-flex justify-content-center">
                      <Loader loading={fetchLoader} />
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="align-items-center">
            <Col xs={12}>
              <Card className="border border-r10px">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table align-middle table-rounded table-row-bordered gs-7 gy-6 mb-0 no-footer">
                      <thead>
                        <tr className="text-start fw-bold fs-16 gs-0 border-bottom ">
                          <th
                            className="min-w-160px  "
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Products added on
                          </th>
                          <th
                            className="min-w-160px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Batch & Expiry
                          </th>
                          <th
                            className="min-w-160px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Zones/Bins
                          </th>
                          <th
                            className="min-w-50px min-w-125px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Units
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stock && stock.length ? (
                          <>
                            {' '}
                            {stock.map((stockVal: any, index: number) => {
                              return (
                                <tr
                                  key={stockVal._id}
                                  className={clsx(
                                    'odd',
                                    checkIsValidBatch(stockVal?.expiry, 7)
                                      ? 'text-dark'
                                      : 'text-danger'
                                  )}
                                >
                                  <td className="fs-15 fw-600">
                                    <span className="d-block">
                                      {Method.convertDateToDDMMYYYY(
                                        stockVal._createdAt
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="fs-15 fw-500">
                                      Batch {stockVal.batch} -{' '}
                                      {stockVal.expiry
                                        ? Method.convertDateToDDMMYYYY(
                                            stockVal.expiry
                                          )
                                        : 'No expiry'}
                                      {/* Batch 5 - 20/04/25 */}
                                    </span>
                                  </td>
                                  <td>
                                    {stockVal?.goodsLoadingArea &&
                                    stockVal?.goodsLoadingArea?.length
                                      ? stockVal?.goodsLoadingArea?.map(
                                          (goodItem: any) => {
                                            return (
                                              <div className="mt-2">
                                                <span
                                                  key={goodItem?.reference}
                                                  className="badge badge-warning text-dark fs-16 fw-600 px-4 min-h-36px min-w-52px me-1 mb-2"
                                                >
                                                  <span>
                                                    {' '}
                                                    {`${goodItem?.name} - Sq: ${goodItem?.sequence}`}
                                                  </span>
                                                  <span className="d-flex text-nowrap">
                                                    {goodItem?.bins &&
                                                    goodItem?.bins?.length ? (
                                                      goodItem?.bins?.map(
                                                        (
                                                          binItem: any,
                                                          binIndex: number
                                                        ) => {
                                                          return (
                                                            <span className="ms-2 fs-16">
                                                              {`| ${binItem?.name} - Sq: ${binItem?.sequence}`}
                                                            </span>
                                                          );
                                                        }
                                                      )
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </span>
                                                </span>
                                              </div>
                                            );
                                          }
                                        )
                                      : '-'}
                                  </td>
                                  <td>
                                    {stockVal.quantityTypes.some(
                                      (item: any, idx: number) =>
                                        item.type === Units
                                    ) ? (
                                      <span
                                        className={clsx('fs-15 fw-600 d-block')}
                                      >
                                        {
                                          stockVal.quantityTypes.find(
                                            (item: any) => item.type === Units
                                          ).stockCount
                                        }{' '}
                                      </span>
                                    ) : (
                                      <span className="fs-15 fw-600  d-block">
                                        -
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={4}>
                              <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                No Data found
                              </div>
                            </td>
                          </tr>
                        )}{' '}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default ProductStockDetails;
