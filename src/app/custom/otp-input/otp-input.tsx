import { createRef, useRef, useState } from 'react';
export type Props = {
  value: string;
  valueLength: number;
  autoFocus?: boolean;
  onChange: (value: string) => void;
};
export default function OtpInput(props: any) {
  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];
  return (
    <div className="otp-group">
      {[1, 2, 3, 4].map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={inputRefs[index]}
          autoComplete="one-time-code"
          className="otp-input fs-22 fw-600 h-60px w-60px me-8"
          value={props.value.length ? props.value[index] : ''}
          style={{ border: 'solid 0.5px #e0e0df' }}
          onChange={(e) => {
            const newValue = [...props.value];
            newValue[index] = e.target.value;
            props.onChange(newValue);
            if (e.target.value.length > 0 && index < inputRefs.length - 1) {
              inputRefs[index + 1]?.current?.focus();
            } else if (e.target.value.trim().length === 0 && index > 0) {
              inputRefs[index - 1]?.current?.focus();
            }
          }}
          maxLength={1}
          autoFocus={index === 0}
          name={index.toString()}
        />
      ))}
    </div>
  );
}
// export default function OtpInput(props: any) {
//   return (
//     <div className="otp-group">
//       {[1, 2, 3, 4].map((digit, index) => (
//         <input
//           key={index}
//           type="text"
//           autoComplete="one-time-code"
//           className="otp-input fs-22 fw-600 h-60px w-60px me-8"
//           value={props.value[index] || ''}
//           style={{ border: 'solid 0.5px #e0e0df' }}
//           onChange={(e) => {
//             const newValue = [...props.value];
//             newValue[index] = e.target.value;
//             props.onChange(newValue);
//           }}
//           maxLength={1}
//           autoFocus={index === 0}
//           name={index.toString()}
//         />
//       ))}
//     </div>
//   );
// }
