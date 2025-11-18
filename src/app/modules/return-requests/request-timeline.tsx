import { Card, Col, Row } from 'react-bootstrap';
import '../orders-delivery/OrderDeliveryTimeline.css';
import { useLocation } from 'react-router-dom';
import {
  Arrived,
  Collected,
  NewRequest,
  OrderCancelled,
  PaymentFailed,
  Refunded,
} from '../../../utils/constants';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Method from '../../../utils/methods';
const RequestTimeline = (props: any) => {
  const { state }: any = useLocation();
  const [details, setDetails] = useState(props.details);
  useEffect(() => {
    setDetails(props.details);
  }, [props]);
  const getLineWidth = (state: any) => {
    if (state === NewRequest) return '0%';
    if (state === NewRequest) {
      return '10%';
    } else if (state === Collected) {
      return '60%';
    } else if (state === Arrived) {
      return '90%';
    } else if (state === Refunded || state === OrderCancelled) {
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
  const isCancelled = false;
  return (
    <>
      <Card className="bg-light border overflow-x-scroll mb-8">
        <Card.Body className="py-0 ">
          <Row className="justify-content-center py-5 order-timeline-box">
            <Col lg={11}>
              <div
                className={clsx(
                  'horizontal timeline min-h-100px pt-3',
                  details.status === OrderCancelled ||
                    details.status === PaymentFailed
                    ? // details.routesUsers.length === 0
                      'cancelled'
                    : ''
                )}
              >
                <div
                  className={`steps ${
                    details.status === OrderCancelled ||
                    details.status === PaymentFailed
                      ? // details.routesUsers.length === 0
                        'cancelled'
                      : ''
                  } `}
                >
                  <div
                    className={`step ${getStatusClass(
                      NewRequest,
                      details.status
                    )}`}
                  >
                    <span className="timeline-text">Return initiated</span>
                    <span className="order-date">
                      {getStatusDate(NewRequest)}
                    </span>
                  </div>
                  {isCancelled ? (
                    isStatusInLogs(Collected) && (
                      <div
                        className={`step ${getStatusClass(
                          Collected,
                          details.status
                        )}`}
                      >
                        <span className="timeline-text">Collected</span>
                        <span className="order-date">
                          {getStatusDate(Collected)}
                        </span>
                      </div>
                    )
                  ) : (
                    <div
                      className={`step ${getStatusClass(
                        Collected,
                        details.status
                      )}`}
                    >
                      <span className="timeline-text">Collected</span>
                      <span className="order-date">
                        {getStatusDate(Collected)}
                      </span>
                    </div>
                  )}
                  {isCancelled ? (
                    isStatusInLogs(Arrived) && (
                      <div
                        className={`step ${getStatusClass(
                          Arrived,
                          details.status
                        )}`}
                      >
                        <span className="timeline-text">
                          Arrived at warehouse
                        </span>
                        <span className="order-date">
                          {getStatusDate(Arrived)}
                        </span>
                      </div>
                    )
                  ) : (
                    <div
                      className={`step ${getStatusClass(
                        Arrived,
                        details.status
                      )}`}
                    >
                      <span className="timeline-text">
                        Arrived at warehouse
                      </span>
                      <span className="order-date">
                        {getStatusDate(Arrived)}
                      </span>
                    </div>
                  )}
                  {/* {props.isGoodsDelivered && (
                    <div
                      className={`step ${getStatusClass(
                        ShipmentDelivered,
                        status
                      )}`}
                    >
                      <span className="timeline-text">Goods Delivered</span>
                      <span className="order-date">{getStatusDate(5)}</span>
                    </div>
                  )}{' '} */}
                  <div
                    className={`step ${getStatusClass(
                      details.status === OrderCancelled ||
                        details.status === PaymentFailed
                        ? OrderCancelled
                        : Refunded,
                      details.status
                    )}`}
                  >
                    <span className="timeline-text">
                      {details.status === OrderCancelled ||
                      details.status === PaymentFailed
                        ? // details.routesUsers.length === 0
                          'Payment failed'
                        : 'Refunded'}
                    </span>
                    <span className="order-date">
                      {' '}
                      {/* {details.routesUsers.length === 0
                        ? details.status === OrderCancelled ||
                          details.status === PaymentFailed
                          ? getStatusDate(OrderCancelled)
                          : getStatusDate(NewRequest)
                        : getStatusDate(Refunded)} */}
                      {details.status === Refunded
                        ? getStatusDate(Refunded)
                        : ''}
                    </span>
                  </div>
                </div>
                {details.status === OrderCancelled ||
                details.status === PaymentFailed ? (
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
export default RequestTimeline;
