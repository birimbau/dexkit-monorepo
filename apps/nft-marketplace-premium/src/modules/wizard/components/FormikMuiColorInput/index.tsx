import { useField } from 'formik';
import {
  MuiColorInput,
  MuiColorInputColors,
  MuiColorInputValue,
} from 'mui-color-input';

export interface FormikMuiColorInputProps {
  name: string;
  label: React.ReactNode;
  fullWidth: boolean;
}

export default function FormikMuiColorInput({
  name,
  fullWidth,
  label,
}: FormikMuiColorInputProps) {
  const [props, meta, helpers] = useField<MuiColorInputValue>(name);

  const handleChange = (color: string, colors: MuiColorInputColors) => {
    helpers.setValue(color);
  };

  return (
    <MuiColorInput
      fullWidth={fullWidth}
      label={label}
      format="hex"
      onChange={handleChange}
      value={props.value}
    />
  );
}
