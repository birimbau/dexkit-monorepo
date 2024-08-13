import {
  Box,
  Collapse,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
} from "@mui/material";
import { useIntl } from "react-intl";

import LazyTextField from "@dexkit/ui/components/LazyTextField";
import Filter from "@mui/icons-material/Filter";
import Search from "@mui/icons-material/Search";
import { useState } from "react";
import useCategoriesBySite from "../../hooks/useCategoriesBySite";
import useProductsBySite from "../../hooks/useProductsBySite";
import { ProductCategoryType } from "../../types";
import CategoryAutocomplete from "../CategoryAutocomplete";
import ProductCard from "../ProductCard";

export interface StoreContentProps {}

export default function StoreContent({}: StoreContentProps) {
  const { formatMessage } = useIntl();

  const [filters, setFilters] = useState<{
    query: string;
    categories: ProductCategoryType[];
    page: number;
    pageSize: number;
  }>({ query: "", categories: [], pageSize: 10, page: 0 });

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = () => {
    setShowFilters((value) => !value);
  };

  const handleClose = () => {
    handleToggleFilters();
  };

  const handleChangeCategories = (categories: ProductCategoryType[]) => {
    setFilters((values) => ({ ...values, categories }));
  };

  const { data: categories } = useCategoriesBySite({ siteId: 1 });

  const { data: products } = useProductsBySite({
    siteId: 1,
    limit: filters.pageSize,
    page: filters.page,
    query: filters.query,
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters((values) => ({
      ...values,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  return (
    <Container>
      <Box sx={{ position: "relative" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" justifyContent="flex-end">
                <IconButton onClick={handleToggleFilters}>
                  <Filter />
                </IconButton>
                <LazyTextField
                  onChange={(value) =>
                    setFilters((filters) => ({ ...filters, query: value }))
                  }
                  value={filters.query}
                  TextFieldProps={{
                    placeholder: formatMessage({
                      id: "search",
                      defaultMessage: "Search",
                    }),
                    variant: "standard",
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Box>
          </Grid>
          {showFilters && (
            <Grid item xs={12}>
              <Collapse in>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <CategoryAutocomplete
                      categories={categories?.items ?? []}
                      value={filters.categories}
                      onChange={handleChangeCategories}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          )}

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {products?.items?.map((product, key) => (
                <Grid key={key} item xs={12} sm={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TablePagination
              component="div"
              count={products?.totalItems ?? 0}
              page={products?.currentPage ?? 0}
              onPageChange={(e, value) => {
                setFilters((values) => ({ ...values, page: value }));
              }}
              rowsPerPage={filters.pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
