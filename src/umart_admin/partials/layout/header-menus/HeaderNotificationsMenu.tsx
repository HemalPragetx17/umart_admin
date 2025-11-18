import { FC, useEffect, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { dashBoardEndPoints } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
const HeaderNotificationsMenu: FC<any> = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [notificationList, setNotificationList] = useState<
    {
      _id: string;
      user: any;
      message: string;
      type: number;
      _createdAt: any;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    (async () => {
      await fetchNotification(page, pageLimit);
    })();
  }, []);
  const fetchNotification = async (pageNo: number, limit: number) => {
    setLoading(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
      needCount: true,
    };
    const apiCallService = new APICallService(
      dashBoardEndPoints.notificationList,
      params
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response?.records?.length > 0) {
        setNotificationList((pre) => {
          const temp = [...pre, ...response?.records];
          return [...temp];
        });
      }
      if (page === 1) {
        setTotalRecords(response?.total || 0);
      }
    }
    setLoading(false);
  };
  const handleScroll = async (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop >= e.target.clientHeight;
    if (bottom) {
      if (
        !(notificationList && notificationList.length === totalRecords) &&
        !loading
      ) {
        let tempPage = page;
        tempPage = tempPage + 1;
        setPage(tempPage);
        await fetchNotification(tempPage, pageLimit);
      }
    }
  };
  return (
    <div
      className={`menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px ${
        props?.show ? 'show' : ''
      }`}
      style={{
        zIndex: 105,
        position: 'fixed',
        inset: '0px 0px auto auto',
        margin: '0px',
        transform: 'translate(-85px, 65px)',
      }}
    >
      <div className="d-flex flex-column rounded-top">
        <h3 className="text-dark fw-bold px-6 my-6">Notifications</h3>
      </div>
      <div className="border-bottom"></div>
      <div
        className="h-350px scroll-y"
        onScroll={handleScroll}
      >
        {notificationList.length > 0
          ? notificationList.map((item, index) => {
              return (
                <>
                  {' '}
                  <div
                    key={`alert${index}`}
                    className="d-flex flex-stack px-3 my-4"
                    // style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex ">
                      {/* <div className="symbol symbol-35px m-2">
                          <span className={clsx('symbol-label', `bg-white`)}>
                            <img
                              src={notifVal.image}
                              alt="check green"
                              height={40}
                              width={40}
                            />
                          </span>
                        </div> */}
                      <div className="mb-0 mx-2">
                        <p className="fs-16 text-dark fw-500 mb-0">
                          {item.message}
                        </p>
                        <div className="text-gray fw-500 fs-14">
                          {Method.convertDateToDDMMYYYY(
                            item?._createdAt
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom"></div>
                </>
              );
            })
          : !loading && (
              <div className="fs-16 fw-500 text-black d-flex align-items-center justify-content-center min-h-350px">
                No Data Found
              </div>
            )}
        {loading &&
          Array(6)
            .fill(0)
            .map((item, index) => {
              return (
                <>
                  <div className="px-2 h-60px"></div>
                  {index !== 5 ? <div className="border-bottom"></div> : <></>}
                </>
              );
            })}
      </div>
    </div>
  );
};
export { HeaderNotificationsMenu };
