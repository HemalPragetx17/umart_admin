import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { APIkey } from '../../../utils/constants';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { geocodeByLatLng } from 'react-google-places-autocomplete';
import { useEffect, useState } from 'react';
// import Autocomplete from 'react-google-autocomplete';
const AutoComplete = (props: any) => {
  const [value, setValue] = useState<any>([
    {
      label: props.address,
      value: props.address,
    },
  ]);
  useEffect(() => {}, []);
  const handlePlaceSelect = async (place: any) => {
    console.log(place);
    setValue(place);
    await geocodeByAddress(place.label)
      .then(async (results) => await getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setValue(place);
        props.handleAddressChange(place.label, lat, lng);
      });
  };
  useEffect(() => {
    value === '' ? setValue('') : setValue(value);
  }, [value]);
  return (
    <>
      {/* <Autocomplete
        apiKey={APIkey}
        onPlaceSelected={(place) => {
          console.log(place);
        }}
        style={
          {
            minWidth: '600px',
            width: 'auto',
            border: '0.5px solid #e0e0df',
            minHeight: '60px',
            height: 'auto',
            borderRadius: '8px',
            padding: '0px',
            fontSize: '1.231rem',
            fontWeight: '600',
            backgroundColor: 'white',
          }
        }
      /> */}
      <GooglePlacesAutocomplete
        apiKey={APIkey}
        apiOptions={{ region: 'tz' }}
        // onSelect={handlePlaceSelect}
        autocompletionRequest={{
          componentRestrictions: {
            country: ['tz'],
          },
        }}
        selectProps={{
          onChange: handlePlaceSelect,
          value,
          placeholder: 'Enter address here',
          styles: {
            option: (base, { isSelected, isFocused }) => ({
              ...base,
              borderBottom: `1px solid #e0e0df`,
              ':last-child': {
                borderBottom: 'none',
              },
              margin: '0px',
              // background: 'white',
              background:
                (isSelected && '') || (isFocused && '#f1faff') || 'transparent',
              padding: '16px',
              ':active': {
                ...base[':active'],
                color: '#1b74e4',
                background: '#f1faff',
              },
              ':hover': {
                ...base[':active'],
                color: '#1b74e4',
                background: '#f1faff',
              },
              color: '#1a1a1a',
              fontSize: '1.154rem',
              fontWeight: '500',
            }),
            control: (base) => ({
              ...base,
              border: props.border
                ? '0.5px solid ' + props.border
                : '0.5px solid #e0e0df',
              boxShadow: 'none',
              minHeight: '60px',
              height: 'auto',
              minWidth: '220px',
              width: 'auto',
              borderRadius: '8px',
              padding: '0px',
              fontSize: '1.231rem',
              fontWeight: '600',
              backgroundColor: 'white',
              ':hover': {
                ...base[':hover'],
                border: props.border
                  ? '0.5px solid ' + props.border
                  : '0.5px solid #e0e0df',
              },
            }),
            menu: (base) => ({
              ...base,
              boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
              color: '#1a1a1a',
            }),
            menuList: (base) => ({
              ...base,
              paddingTop: '0px',
              paddingBottom: '0px',
              borderRadius: '5px',
              width: 'auto',
              color: '#1a1a1a',
            }),
            menuPortal: (base, props) => ({
              ...base,
              zIndex: 9999,
            }),
            indicatorSeparator: (base) => ({
              ...base,
              display: 'none',
            }),
            indicatorsContainer: (base) => ({
              ...base,
              color: '#f9f9f9',
              strokeWidth: '5px',
            }),
            multiValueRemove: (base, { data }) => ({
              ...base,
              height: '12px',
              ':hover': {
                backgroundColor: '#e7f1fd',
              },
              svg: {
                height: '22px',
                width: '22px',
                fill: '#7c7c7c',
              },
            }),
          },
        }}
        onLoadFailed={(error) => {
          console.log(error);
        }}
        // autocompletionRequest={}
      />
    </>
  );
};
export default AutoComplete;
