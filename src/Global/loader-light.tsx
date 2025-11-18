import BeatLoader from 'react-spinners/BeatLoader';
const LoaderLight = (props: any) => {
  return (
    <BeatLoader
      color={'#0fff50'}
      loading={props.loading}
      size={20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};
export default LoaderLight;
