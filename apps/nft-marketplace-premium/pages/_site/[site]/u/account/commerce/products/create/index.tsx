import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductPriceTable from '@/modules/commerce/components/ProductPriceTable';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Add from '@mui/icons-material/Add';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export default function CreateProductPage() {
  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeader
            breadcrumbs={[
              {
                caption: (
                  <FormattedMessage id="commerce" defaultMessage="Commerce" />
                ),
                uri: '/u/account/commerce',
              },
              {
                caption: (
                  <FormattedMessage id="products" defaultMessage="Products" />
                ),
                uri: '/u/account/commerce/products',
              },
              {
                caption: (
                  <FormattedMessage id="create" defaultMessage="Create" />
                ),
                uri: '/u/account/commerce/checkout/create',
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Formik onSubmit={() => {}} initialValues={{}}>
            {({}) => (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <ButtonBase
                      sx={{
                        position: 'relative',
                        p: 2,
                        borderRadius: (theme) => theme.shape.borderRadius / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(0,0,0, 0.2)'
                            : alpha(theme.palette.common.white, 0.1),

                        backgroundImage: `url()`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    >
                      <Stack
                        sx={{
                          height: 150,
                          maxHeight: 300,
                          minHeight: 50,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: (theme) =>
                            theme.palette.getContrastText(
                              theme.palette.mode === 'light'
                                ? 'rgba(0,0,0, 0.2)'
                                : alpha(theme.palette.common.white, 0.1),
                            ),
                        }}
                      ></Stack>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      fullWidth
                      label={
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ProductPriceTable />
                  </Grid>
                  <Grid item xs={12}>
                    <Button startIcon={<Add />} variant="outlined">
                      <FormattedMessage
                        id="add.price"
                        defaultMessage="Add Price"
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button>
                          <FormattedMessage
                            id="cancel"
                            defaultMessage="cancel"
                          />
                        </Button>
                        <Button variant="contained">
                          <FormattedMessage
                            id="create"
                            defaultMessage="Create"
                          />
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Formik>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
