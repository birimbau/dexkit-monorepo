import NetworkSelect from "./NetworkSelect";

import { useField } from "formik";

export interface FormikNetworkSelectProps {
  name: string;
}

export default function FormikNetworkSelect({
  name,
}: FormikNetworkSelectProps) {
  const [props, meta, helpers] = useField(name);

  const handleChange = (chainId?: number | undefined) => {
    helpers.setValue(chainId);
  };

  return <NetworkSelect onSelect={handleChange} chainId={props.value} />;
}
