import { useEffect, useRef, useState } from 'react';
import { useSocket } from './Socket';
import { Card } from 'react-bootstrap';
import logo from '../../../../../public/media/logos/favicon.png';
import LoaderLight from '../../../../Global/loader-light';
import Logo from '../../../../umart_admin/assets/media/umart-logo-black.svg';
import clsx from 'clsx';
import sound from '../../../../umart_admin/assets/media/sound.wav';
const OrderStatusScreen = () => {
  const { socket } = useSocket();
  const [deliveryUsers, setDeliveryUser] = useState<any>([]);
  const prevDeliveryUser = useRef<any>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const addClassForAnimation = (prevData: any, currentData: any) => {
    prevData = prevData.map((item: any) => {
      return {
        name: item.name,
        assignedOrder: item.assignedOrder,
        reference: item.reference,
        totalPackedOrders: item.totalPackedOrders,
      };
    });
    if (prevData && currentData && currentData.length > 0) {
      const tempData: any = [...currentData];
      currentData.forEach((item: any, index: number) => {
        const tempPrevObj = prevData.find(
          (val: any) => val.reference === item.reference
        );
        if (tempPrevObj) {
          const { isSame, key } = compareObject(tempPrevObj, item);
          if (!isSame && key) {
            tempData[index].isCellChanged = true;
            playSound();
          }
        } else {
          tempData[index] = { ...tempData[index], isNewRow: true };
          // const tempObj = { ...tempData[tempData.length - 1], isNewRow: true };
          // tempData[tempData.length - 1] = tempObj;
          playSound();
        }
      });
      setDeliveryUser(tempData);
    }
    if (prevData.length > currentData.length) {
      const tempPrev = [...prevData];
      prevData.filter((item: any, index: number) => {
        const isFound = currentData.find(
          (val: any) => val.reference === item.reference
        );
        if (!isFound) {
          const temp = { ...item };
          temp.isRemoved = true;
          tempPrev[index] = temp;
        }
      });
      setDeliveryUser(tempPrev);
      playSound();
      setTimeout(() => {
        setDeliveryUser(currentData);
      }, 1000);
    }
  };
  const compareObject = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // if (keys1.length !== keys2.length) {
    //   return { isSame: false, key: null };
    // }
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        if (
          key === 'assignedOrder' &&
          obj1['totalPackedOrders'] !== obj2['totalPackedOrders']
        ) {
          return { isSame: false, key: 'assignAndPakcedChange' };
        }
        if (
          key === 'totalPackedOrders' &&
          obj1['assignedOrder'] === obj2['assignedOrder']
        ) {
          return { isSame: false, key: 'beinpackedAndPakcedChange' };
        }
        return { isSame: false, key: key + 'Change' };
      }
    }
    return { isSame: true, key: null };
  };
  const playSound = () => {
    // const audio = new Audio();
    // audio.play();
    if (audioRef.current) {
      if (audioRef.current.muted) {
        console.log('muted');
      } else {
        audioRef.current.play().catch((error) => {
          // Play failed, log the error
          console.error('Failed to play notification sound:', error);
        });
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    const listOrders = (data: any) => {
      const currentData: any = data?.records?.routeUser;
      if (prevDeliveryUser.current.length) {
        addClassForAnimation(prevDeliveryUser.current, currentData);
      } else {
        setDeliveryUser(currentData);
      }
      // if (prevData.length) {
      //   addClassForAnimation(prevData, currentData);
      // }
      setLoading(false);
    };
    socket?.on('connect', () => {
      console.log('conncted');
    });
    socket?.on('listOrders', listOrders);
    const intervalId = setInterval(() => {
      socket?.emit('listOrderScreen');
    }, 1000);
    return () => {
      socket?.off('listOrders', listOrders);
      clearInterval(intervalId);
    };
  }, [socket]);
  useEffect(() => {
    const prevData: any = [...deliveryUsers];
    prevDeliveryUser.current = prevData;
  }, [deliveryUsers]);
  // useEffect(() => {
  //   const prevData: any = [...deliveryUsers];
  //   if (prevDeliveryUser.current.length) {
  //     addClassForAnimation(prevDeliveryUser.current, deliveryUsers);
  //   }
  // }, [prevDeliveryUser]);
  return (
    <div
      className=" h-100 d-flex justify-content-center align-items-start py-20 px-20 overflow-scroll"
      style={{
        backgroundColor: '#231F20',
      }}
    >
      {loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <LoaderLight loading={loading} />
        </div>
      ) : deliveryUsers?.length > 0 ? (
        <Card
          className="border rounded  p-0 border-bottom-white-light w-100 border-2 position-relative "
          style={{ backgroundColor: '#231F20' }}
        >
          <Card.Body className=" p-0">
            <div className="table-responsive">
              <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0 p-0 border-4">
                <thead>
                  <tr className="fw-bold fs-40 fw-600 text-dark border-bottom h-135px align-middle text-white  border-bottom-white-light ">
                    <th className="min-w-275px text-white ps-15">
                      Driver name
                    </th>
                    <th className="min-w-275px text-white ps-15 text-center">
                      Assigned orders
                    </th>
                    <th className="min-w-275px  text-white ps-15 text-center">
                      Being packed
                    </th>
                    <th className="min-w-275px text-green ps-15 text-center">
                      Ready to collect
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    <>
                      {deliveryUsers.length ? (
                        <>
                          {deliveryUsers.map(
                            (customVal: any, customIndex: number) => {
                              return (
                                <tr
                                  key={customIndex}
                                  className={clsx(
                                    'fs-36 ps-4  border-row h-125px ',
                                    customVal.isNewRow
                                      ? 'slideInAnimation'
                                      : '',
                                    customVal.isRemoved
                                      ? 'slideOutAnimation'
                                      : '',
                                    customVal.isCellChanged
                                      ? 'cell-change-animation'
                                      : ''
                                  )}
                                >
                                  <td className={clsx('text-white ps-15 ')}>
                                    <div
                                    // className={clsx(
                                    //   customVal?.nameChange
                                    //     ? 'cell-change-animation p-4'
                                    //     : ''
                                    // )}
                                    >
                                      {customVal.name}
                                    </div>
                                  </td>
                                  <td
                                    className={clsx(
                                      'text-white ps-15 text-center'
                                    )}
                                  >
                                    <div
                                    // className={clsx(
                                    //   customVal?.assignedOrderChange ||
                                    //     customVal.assignAndPakcedChange
                                    //     ? 'cell-change-animation p-4'
                                    //     : ''
                                    // )}
                                    >
                                      {customVal?.assignedOrder
                                        ? `${customVal.assignedOrder} ${
                                            parseInt(customVal.assignedOrder) >
                                            1
                                              ? 'Orders'
                                              : 'Order'
                                          }`
                                        : '-'}
                                    </div>
                                  </td>
                                  <td
                                    className={clsx(
                                      'text-white ps-15 text-center'
                                    )}
                                  >
                                    <div
                                    // className={clsx(
                                    //   customVal?.beinpackedAndPakcedChange
                                    //     ? 'cell-change-animation p-4'
                                    //     : ''
                                    // )}
                                    >
                                      {parseInt(customVal?.assignedOrder) -
                                        parseInt(customVal?.totalPackedOrders) >
                                      0
                                        ? `${
                                            parseInt(customVal?.assignedOrder) -
                                            parseInt(
                                              customVal?.totalPackedOrders
                                            )
                                          }  ${
                                            parseInt(customVal?.assignedOrder) -
                                              parseInt(
                                                customVal?.totalPackedOrders
                                              ) >
                                            1
                                              ? 'Orders'
                                              : 'Order'
                                          }`
                                        : '-'}
                                    </div>
                                  </td>
                                  <td
                                    className={clsx(
                                      'text-green ps-15 text-center'
                                    )}
                                  >
                                    <div
                                    // className={clsx(
                                    //   customVal?.totalPackedOrdersChange ||
                                    //     customVal.assignAndPakcedChange ||
                                    //     customVal.beinpackedAndPakcedChange
                                    //     ? 'cell-change-animation p-4'
                                    //     : ''
                                    // )}
                                    >
                                      {customVal?.totalPackedOrders
                                        ? `${customVal.totalPackedOrders}  ${
                                            parseInt(
                                              customVal.totalPackedOrders
                                            ) > 1
                                              ? 'Orders'
                                              : 'Order'
                                          }`
                                        : '-'}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                          {/* <tr className="fs-24 ps-4 text-center border-row h-75px">
                          <td className="text-white ">Virat kohli</td>
                          <td className="text-white">10</td>
                          <td className="text-white">12</td>
                          <td className="text-white">13</td>
                        </tr> */}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>
                            <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                              {/* No Data Available */}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  }
                </tbody>
              </table>
            </div>
          </Card.Body>
          <div className="position-absolute z-index-2 w-100 d-flex justify-content-center logo-position">
            <img src={Logo} />
          </div>
          <audio
            ref={audioRef}
            src={sound}
          />
        </Card>
      ) : (
        <div className="w-100 fs-48 h-100 align-items-center fw-bold d-flex justify-content-center text-white">
          No Data Available
        </div>
      )}
    </div>
  );
};
export default OrderStatusScreen;
