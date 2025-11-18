import { Card, Col, Row } from 'react-bootstrap';
import './OrderDeliveryTimeline.css';
import { useLocation } from 'react-router-dom';
import {
  OrderCancelled,
  OrderDelivered,
  OrderOutForDelivery,
  OrderProcessed,
  OrderSubmitted,
  PaymentFailed,
  OrderFailed,
} from '../../../utils/constants';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Method from '../../../utils/methods';
const OrderDeliveryTimeline = (props: any) => {
  const { state }: any = useLocation();
  const [details, setDetails] = useState(props.details);
  useEffect(() => {
    setDetails(props.details);
  }, [props]);
  const getLineWidth = (state: any) => {
    if (state === OrderSubmitted && isCancelled) return '0%';
    if (state === OrderSubmitted) {
      return '10%';
    } else if (state === OrderProcessed) {
      return '60%';
    } else if (state === OrderOutForDelivery) {
      return '90%';
    } else if (
      state === OrderDelivered ||
      state === OrderCancelled ||
      state === OrderFailed ||
      isCancelled
    ) {
      return '100%';
    } else {
      return '0%';
    }
  };
  const getStatusDate = (status: number) => {
    const log = details.statusesLogs.find((log: any) => log.status === status);
    if (log && log.statusUpdatedAt) {
      const date = Method.convertDateToDDMMYYYYHHMMAMPM(log.statusUpdatedAt);
      return date;
    }
    return '';
  };
  const getStatusClass = (statusIndex: number, currentIndex: number) => {
    if (statusIndex <= currentIndex) {
      return 'current';
    } else {
      return '';
    }
  };
  const isStatusInLogs = (status: number) => {
    return details.statusesLogs.some((log: any) => log.status === status);
  };
  const isCancelled =
    details.routesUsers.length === 0 && !details?.scheduleOrder;
  return (
    <>
      <Card className="bg-light border overflow-x-scroll mb-8">
        <Card.Body className="py-0">
          <Row className="justify-content-center py-5 order-timeline-box">
            <Col lg={11}>
              <div
                className={clsx(
                  'horizontal timeline min-h-100px pt-3',
                  (details.status === OrderCancelled ||
                    details.status === PaymentFailed ||
                    details.status === OrderFailed) &&
                    // ||
                    // details.routesUsers.length === 0
                    ((!details?.instantOrder &&
                      // !details?.selfPickedUp &&
                      !details?.scheduleOrder) ||
                      details.routesUsers.length == 0)
                    ? 'cancelled'
                    : ''
                )}
              >
                <div
                  className={`steps ${
                    (details.status === OrderCancelled ||
                      details.status === PaymentFailed ||
                      details.status === OrderFailed) &&
                    //  ||
                    // details.routesUsers.length === 0
                    ((!details?.instantOrder &&
                      // !details?.selfPickedUp &&
                      !details?.scheduleOrder) ||
                      details.routesUsers.length == 0)
                      ? 'cancelled'
                      : ''
                  } `}
                >
                  <div
                    className={`step ${getStatusClass(
                      OrderSubmitted,
                      details.status
                    )}`}
                  >
                    <span className="timeline-text">Order placed</span>
                    <span className="order-date">
                      {getStatusDate(OrderSubmitted)}
                    </span>
                  </div>
                  {isCancelled ? (
                    isStatusInLogs(OrderProcessed) && (
                      <div
                        className={`step ${getStatusClass(
                          OrderProcessed,
                          details.status
                        )}`}
                      >
                        <span className="timeline-text">
                          {details?.instantOrder ||
                          details?.selfPickedUp ||
                          details?.scheduleOrder
                            ? 'Order Processed '
                            : ' Preparing for dispatch'}
                        </span>
                        <span className="order-date">
                          {getStatusDate(OrderProcessed)}
                        </span>
                      </div>
                    )
                  ) : (
                    <div
                      className={`step ${getStatusClass(
                        OrderProcessed,
                        details.status
                      )}`}
                    >
                      <span className="timeline-text">
                        {details?.instantOrder ||
                        details?.selfPickedUp ||
                        details?.scheduleOrder
                          ? 'Order Processed '
                          : ' Preparing for dispatch'}
                      </span>
                      <span className="order-date">
                        {getStatusDate(OrderProcessed)}
                      </span>
                    </div>
                  )}
                  {isCancelled ? (
                    isStatusInLogs(OrderOutForDelivery) && (
                      <div
                        className={`step ${getStatusClass(
                          OrderOutForDelivery,
                          details.status
                        )}`}
                      >
                        <span className="timeline-text">Out for delivery</span>
                        <span className="order-date">
                          {getStatusDate(OrderOutForDelivery)}
                        </span>
                      </div>
                    )
                  ) : (
                    <div
                      className={`step ${getStatusClass(
                        OrderOutForDelivery,
                        details.status
                      )}`}
                    >
                      <span className="timeline-text"> Out for delivery</span>
                      <span className="order-date">
                        {getStatusDate(OrderOutForDelivery)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`step ${getStatusClass(
                      details.status === OrderCancelled ||
                        details.status === PaymentFailed ||
                        details.status === OrderFailed
                        ? OrderCancelled
                        : OrderDelivered,
                      details.status
                    )}`}
                  >
                    <span className="timeline-text">
                      {(details.status === OrderCancelled ||
                        details.status === PaymentFailed ||
                        details.status === OrderFailed) &&
                      // ||
                      // details.routesUsers.length === 0
                      ((!details?.instantOrder &&
                        // !details?.selfPickedUp &&
                        !details?.scheduleOrder) ||
                        details.routesUsers.length == 0)
                        ? details.status === OrderCancelled
                          ? 'Cancelled'
                          : details?.status === PaymentFailed
                          ? 'Payment Failed'
                          : 'Order Failed'
                        : 'Delivered'}
                    </span>
                    <span className="order-date">
                      {''}
                      {details.routesUsers.length === 0 &&
                      !details?.instantOrder &&
                      !details.selfPickedUp &&
                      !details?.scheduleOrder
                        ? details.status === OrderCancelled ||
                          details.status === PaymentFailed ||
                          details.status === OrderFailed
                          ? getStatusDate(details?.status)
                          : getStatusDate(OrderSubmitted)
                        : getStatusDate(OrderDelivered)}
                      {}
                    </span>
                  </div>
                </div>
                {details.status === OrderCancelled ||
                details.status === PaymentFailed ||
                details.status === OrderFailed ? (
                  <></>
                ) : (
                  <div
                    className="line"
                    style={{
                      width: getLineWidth(details.status),
                      transition: '5s ease-out',
                    }}
                  ></div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default OrderDeliveryTimeline;
