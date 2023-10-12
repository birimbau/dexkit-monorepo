import { Button, FormControlLabel, Grid } from "@mui/material";
import { ethers } from "ethers";
import { Field, Formik } from "formik";
import { Autocomplete, Checkbox, TextField } from "formik-mui";
import { useIfpsUploadMutation } from "../hooks";

import MuiTextField from "@mui/material/TextField";
import { Form, FormElement, FormOutputFormat } from "../types";

import { useWeb3React } from "@web3-react/core";
import React from "react";
import * as Yup from "yup";
import DecimalInput from "./DecimalInput";
import { ImageInput } from "./ImageInput";
import { IpfsImageInput } from "./IpfsImageInput";
import SharesArrayInput from "./SharesArrayInput";

function validateAddress(message: string) {
  return (value: string) => {
    return !ethers.utils.isAddress(value) ? message : undefined;
  };
}

function getValidation(type?: string) {
  if (type === "address") {
    return validateAddress("invalid address");
  }
}

export interface GenericFormProps {
  form: Form;
  output: FormOutputFormat;
  context?: { [key: string]: any };
  onSubmit: (values: any[]) => Promise<void>;
  actionLabel: React.ReactNode;
}

export default function GenericForm({
  form,
  output,
  onSubmit,
  context,
  actionLabel,
}: GenericFormProps) {
  const { account } = useWeb3React();

  const renderInput = (el: FormElement) => {
    if (el.type === "input") {
      if (el.component?.type === "address") {
        return (
          <Field
            component={TextField}
            name={el.ref}
            size="small"
            fullWidth
            validate={getValidation(el.component.type)}
            disabled={el.locked}
            helperText={el.helperText}
            required
            label={el.label}
          />
        );
      } else if (el.component?.type === "address-array") {
        return (
          <Field
            component={Autocomplete}
            freeSolo
            multiple
            size="small"
            autoSelect
            name={el.ref}
            required
            helperText={el.helperText}
            options={[]}
            filterSelectedOptions
            renderInput={(params: any) => (
              <MuiTextField
                {...params}
                label={el.label}
                placeholder="Address"
              />
            )}
          />
        );
      } else if (el.component?.type === "shares-array") {
        return <SharesArrayInput reference={el.ref as string[]} />;
      } else if (el.component?.type === "checkbox") {
        return (
          <FormControlLabel
            control={
              <Field
                component={Checkbox}
                name={el.ref}
                type="checkbox"
                size="small"
                helperText={el.helperText}
                validate={getValidation(el.component.type)}
                disabled={el.locked}
                required
              />
            }
            label={el.label}
          />
        );
      } else if (el.component?.type === "image") {
        return <IpfsImageInput label={el.label} name={el.ref as string} />;
      } else if (el.component?.type === "image-url") {
        return <ImageInput label={el.label} name={el.ref as string} />;
      } else if (el.component?.type === "hidden") {
        return false;
      } else if (el.component?.type === "decimal") {
        return (
          <DecimalInput
            label={el.label}
            name={el.ref as string}
            decimals={el.component.decimals}
            helperText={el.helperText}
            isPercentage={el?.component?.isPercentage}
            maxDigits={el?.component?.maxDigits}
          />
        );
      } else {
        return (
          <Field
            component={TextField}
            name={el.ref as string}
            size="small"
            fullWidth
            disabled={el.locked}
            label={el.label}
            helperText={el.helperText}
            required
          />
        );
      }
    }
  };

  const renderElements = (elements: FormElement[], group?: string) => {
    return elements
      .map((el, key) => {
        if (el.type === "input" && el.component?.type !== "hidden") {
          return (
            <Grid
              key={group ? `${group}-${key}-${el.type}` : `${key}-${el.type}`}
              item
              xs={el.col?.xs ? el.col.xs : 12}
              sm={el.col?.sm}
            >
              {renderInput(el)}
            </Grid>
          );
        } else if (el.type === "input-group") {
          return (
            <Grid
              key={`group-${key}`}
              item
              xs={el.col?.xs ? el.col.xs : 12}
              sm={el.col?.sm}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                alignContent="center"
              >
                {renderElements(el.inputs, `group-${key}`)}
              </Grid>
            </Grid>
          );
        }
      })
      .filter((i) => i !== undefined);
  };

  const getInitialValues = (elements: FormElement[]): any => {
    return elements
      .filter((el) => el.type === "input")
      .map((el) => {
        if (el.type === "input") {
          if (el.component?.type === "address" && el.ref) {
            if (el.component.subtype === "connected-address") {
              return { [el.ref as string]: account };
            }
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: "" };
            }
          } else if (el.component?.type === "checkbox" && el.ref) {
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: false };
            }
          } else if (el.component?.type === "address-array" && el.ref) {
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: [] };
            }
          } else if (
            el.component?.type === "hidden" &&
            el.component.subtype === "connected-address"
          ) {
            return { [el.ref as string]: account };
          } else if (
            el.component?.type === "hidden" &&
            typeof el.defaultValue === "object" &&
            context
          ) {
            if ("ref" in el.defaultValue) {
              return { [el.ref as string]: context[el.defaultValue.ref] };
            }
          }

          return {
            [el.ref as string]: el.defaultValue ? el.defaultValue : undefined,
          };
        }
      })
      .reduce((obj, curr) => {
        return { ...obj, ...curr };
      }, {});
  };

  const getValidationSchema = (elements: FormElement[]): any => {
    const mapping: any = (els: FormElement[]) => {
      return els.map((el: FormElement) => {
        if (el.type === "input") {
          if (el.component?.type === "address" && el.ref) {
            return {
              [el.ref as string]: Yup.string()
                .test("address", (value) => {
                  return value !== undefined
                    ? ethers.utils.isAddress(value)
                    : true;
                })
                .required(),
            };
          } else if (el.component?.type === "checkbox" && el.ref) {
            return { [el.ref as string]: Yup.boolean().required() };
          } else if (el.component?.type === "address-array" && el.ref) {
            return {
              [el.ref as string]: Yup.array(
                Yup.string()
                  .test("address", (value) => {
                    return value !== undefined
                      ? ethers.utils.isAddress(value)
                      : true;
                  })
                  .required()
              ),
            };
          } else if (
            (el.component?.type === "image" ||
              el.component?.type === "image-url") &&
            el.ref
          ) {
            return {
              [el.ref as string]: Yup.string().required(),
            };
          } else if (
            el.component?.type === "hidden" &&
            typeof el.defaultValue === "object"
          ) {
            if ("ref" in el.defaultValue) {
              if (el.defaultValue.ref === "trustedForwarders") {
                return {
                  [el.ref as string]: Yup.array(Yup.string()).required(),
                };
              }
            }

            return {
              [el.ref as string]: Yup.string().required(),
            };
          } else if (el.component?.type === "hidden" && el.ref) {
            return {
              [el.ref as string]: Yup.string().required(),
            };
          }

          if (Array.isArray(el.ref)) {
            if (el.component?.type === "shares-array") {
              return {
                [el.ref[0]]: Yup.array(
                  Yup.string().test("address", (value) => {
                    return value !== undefined
                      ? ethers.utils.isAddress(value)
                      : true;
                  })
                ).required(),
                [el.ref[1]]: Yup.array(Yup.string()).required(),
              };
            }
          }

          return { [el.ref as string]: Yup.string().required() };
        } else if (el.type === "input-group") {
          return mapping(el.inputs).reduce((o: any, curr: any) => {
            return { ...o, ...curr };
          }, {});
        }
      });
    };

    const obj = mapping(elements);

    let newObj = obj.reduce((o: any, curr: any) => {
      return { ...o, ...curr };
    }, {});

    return Yup.object().shape(newObj);
  };

  const ipfsUploadMutation = useIfpsUploadMutation();

  const handleSubmit = async (formValues: any) => {
    const ocurrsKeys: string[] = [];

    const mapping = (elements: FormElement[]) => {
      return elements
        .map((e: FormElement) => {
          if (e.type === "input-group") {
            return e.inputs;
          }

          return [e];
        })
        .flat();
    };

    const fields = mapping(form.elements);

    const values = Object.keys(formValues)
      .map((key) => {
        let field = fields.find((f) => f.type === "input" && f.ref === key);

        if (field?.component?.type === "decimal") {
          return {
            [key]: ethers.utils
              .parseUnits(formValues[key], field.component.decimals)
              .toString(),
          };
        } else if (
          field?.component?.type === "hidden" &&
          field.component.subtype === "connected-address"
        ) {
          return {
            [key]: account,
          };
        }

        return { [key]: formValues[key] };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      }, {});

    let result: any = output.objects
      .map((obj) => {
        return {
          [obj.name]: obj.fields
            .map((fieldName: any) => {
              if (!fieldName.fields) {
                if (fieldName.type === "decimal") {
                  let vals: any;

                  if (Array.isArray(values[fieldName.name])) {
                    vals = values[fieldName.name].map((v: string) =>
                      ethers.utils.parseUnits(v, fieldName.decimals).toString()
                    );
                  } else {
                    vals = ethers.utils
                      .parseUnits(values[fieldName.name], fieldName.decimals)
                      .toString();
                  }

                  return {
                    [fieldName.name]: vals,
                  };
                }

                return { [fieldName.name]: values[fieldName.name] };
              }

              const res = {
                [fieldName.name]: fieldName.fields
                  ?.map((f: any) => {
                    if (typeof f === "string") {
                      if (fieldName.name) {
                        return { [f]: values[f] };
                      }
                    }
                  })
                  .reduce((prev: any, curr: any) => {
                    return { ...prev, ...curr };
                  }, {}),
              };

              if (fieldName.type === "ipfs-file") {
                ocurrsKeys.push(fieldName.name);
              }

              return res;
            })
            .filter((f) => f !== undefined)
            .reduce((prev, curr) => {
              return { ...prev, ...curr };
            }, {}),
        };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      }, {});

    for (let obj of Object.keys(result)) {
      for (let key of ocurrsKeys) {
        const content = Buffer.from(JSON.stringify(result[obj][key]));

        let cid = await ipfsUploadMutation.mutateAsync({
          content,
          token: "",
        });

        result[obj][key] = `ipfs://${cid}`;
      }
    }

    await onSubmit(result);
  };

  return (
    <Formik
      initialValues={getInitialValues(form.elements)}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema(form.elements)}
    >
      {({ submitForm, isSubmitting, isValid, errors, values }) => (
        <Grid container spacing={2}>
          {renderElements(form.elements)}
          <Grid item xs={12}>
            <Button
              disabled={isSubmitting || !isValid}
              onClick={submitForm}
              variant="contained"
              color="primary"
            >
              {actionLabel}
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
