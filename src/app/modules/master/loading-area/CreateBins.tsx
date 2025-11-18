import CrossIcon from '../../../../umart_admin/assets/media/svg_uMart/cross.png';
type PropsType = {
  goodsLoadingArea: any;
  onRemove: (loadingIndex: number, binsIndex: number) => void;
};
const CreateBins = ({ goodsLoadingArea, onRemove }: PropsType) => {
  return goodsLoadingArea.map((item: any, loadingIndex: number) => {
    return (
      <div className="d-flex  align-items-center">
        {item?.bins && item?.bins?.length > 0 ? (
          <span className="fs-12 text-black">{`${item?.name} Bins : `}</span>
        ) : (
          <></>
        )}
        <div className='d-flex flex-wrap'>
          {item?.bins.map((val: any, binsIndex: number) => {
            return (
              <>
                <span
                  key={val?.sequence}
                  className=" fs-12 mx-2 bg-light-primary text-black py-2 rounded-1 px-4 mb-2 fw-500 d-flex align-items-center"
                >
                  {`${val?.name} ${val?.sequence ? ' - ' + val?.sequence : ''}`}{' '}
                  <span className="text-gray fw-700 ms-2">
                    <img
                      className="cursor-pointer"
                      src={CrossIcon}
                      height={13}
                      width={13}
                      onClick={() => {
                        onRemove(loadingIndex, binsIndex);
                      }}
                    />
                  </span>
                </span>
              </>
            );
          })}
        </div>
      </div>
    );
  });
};
export default CreateBins;
