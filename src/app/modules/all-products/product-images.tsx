import { Card } from 'react-bootstrap';
import CloseSVG from '../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import UploadImgWhite from '../../../umart_admin/assets/media/svg_uMart/upload-img-white.svg';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { fileValidation } from '../../../Global/fileValidation';
const ProductImages = (props: any) => {
  const [dragId, setDragId] = useState();
  const [generalData, setGeneralData] = useState<any>(props.generalData);
  const [generalDataValidation, setGeneralDataValidation] = useState<any>(
    props.validations
  );
  useEffect(() => {
    props.onGeneralDataChange(generalData);
  }, [generalData, props]);
  useEffect(() => {
    props.onValidationChange(generalDataValidation);
  }, [generalDataValidation]);
  useEffect(() => {
    setGeneralDataValidation(props.validations);
  }, [props.validations]);
  useEffect(() => {}, [props.validations]);
  const handleImage = async (event: any, index: number) => {
    const selectedFiles = event.target.files;
    let temp = { ...generalData };
    if (!selectedFiles) return;
    else {
      let temp2 = JSON.parse(JSON.stringify(temp));
      let generalValidationTemp = JSON.parse(
        JSON.stringify({ ...generalDataValidation })
      );
      for (let i = 0; i < selectedFiles.length; i++) {
        if (fileValidation(selectedFiles?.[i])) {
          await toBase64(selectedFiles?.[i]).then((data) => {
            temp2.combinations[index].units.images.push({
              url: URL.createObjectURL(selectedFiles?.[i]),
              obj: data,
            });
          });
        }
      }
      let imagesTemp: any = [];
      temp2.combinations[index].units.images.map((val: any, index: number) => {
        imagesTemp.push({ ...val, id: index, order: index });
      });
      temp2.combinations[index].units.images = imagesTemp;
      event.target.value = '';
      await setGeneralData(temp2);
      generalValidationTemp.combinations[index].units.images = false;
      await setGeneralDataValidation(generalValidationTemp);
    }
  };
  const toBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleRemoveImage = (index: number, id: number) => {
    let temp = { ...generalData };
    let generalValidationTemp = { ...generalDataValidation };
    if (temp.combinations[index].units.images.length > 0) {
      const filterImages = temp.combinations[index].units.images.filter(
        (image: any) => image.id !== id
      );
      temp.combinations[index].units.images = filterImages;
      if (!filterImages.length) {
        generalValidationTemp.combinations[index].units.images = true;
      }
    }
    setGeneralDataValidation(generalValidationTemp);
    setGeneralData(temp);
  };
  const handleDrag = async (ev: any) => {
    await setDragId(ev.currentTarget.id.toString());
  };
  const handleDrop = async (event: any, index: number, imageIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    const dragImage = temp.combinations[index].units.images.find(
      (image: any) => image.id == dragId
    );
    const dropImage = temp.combinations[index].units.images.find(
      (image: any) => image.id == event.currentTarget.id
    );
    const arr = moveItem(dragImage.id - 1, dropImage.id - 1, index);
    await setGeneralData(arr);
  };
  const moveItem = (from: any, to: any, index: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    const f = temp.combinations[index].units.images.splice(from, 1)[0];
    temp.combinations[index].units.images.splice(to, 0, f);
    return temp;
  };
  return (
    <>
      {generalData &&
        generalData.combinations.map((val: any, index: number) => {
          return (
            <Card
              key={index}
              className="py-2 bg-light border mb-8"
            >
              <Card.Header className="border-bottom-0">
                <Card.Title className="fs-22 fw-bolder">{val.title}</Card.Title>
              </Card.Header>
              <Card.Body className="pt-0">
                <div className="d-flex flex-wrap flex-row flex-start gap-lg-6 gap-4">
                  <div
                    className={clsx(
                      'upload-btn-wrapper',
                      generalDataValidation.combinations[index].units &&
                        generalDataValidation.combinations[index].units
                          .images &&
                        val.units.images.length === 0
                        ? ' border border-danger'
                        : ''
                    )}
                  >
                    {
                      //props.validations
                    }{' '}
                    <div className="symbol symbol-125px symbol-md-170px">
                      <img
                        src={UploadImgWhite}
                        alt=""
                      />
                    </div>
                    <input
                      className="w-100 h-100"
                      type="file"
                      name="myfile"
                      multiple
                      accept="image/png, image/jpeg"
                      id={val.title}
                      onChange={(event) => {
                        handleImage(event, index);
                      }}
                      disabled={props.loading}
                    />
                  </div>
                  {val.units.images
                    // .sort((a: any, b: any) => a.order - b.order)
                    .map((imageVal: any, imageIndex: number) => {
                      return (
                        <div key={imageIndex}>
                          <div
                            className="position-relative"
                            draggable={true}
                            id={imageVal.id}
                            onDragOver={(ev) => ev.preventDefault()}
                            onDragStart={handleDrag}
                            onDrop={(event) => {
                              handleDrop(event, index, imageIndex);
                            }}
                          >
                            <div className="symbol symbol-125px symbol-md-168px bg-body">
                              <img
                                className="img-fluid p-2 object-fit-contain"
                                src={imageVal.url}
                                alt=""
                              />
                            </div>
                            {!props.loading ? (
                              <img
                                className="img-fluid close-top-2"
                                src={CloseSVG}
                                alt=""
                                onClick={() => {
                                  handleRemoveImage(index, imageVal.id);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card.Body>
            </Card>
          );
        })}
    </>
  );
};
export default ProductImages;
