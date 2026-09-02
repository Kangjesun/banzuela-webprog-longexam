import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../../context/AuthContext";

import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService";


const section = {
  borderTop: "2px solid #18181b",
  borderBottom: "2px solid #18181b",
  backgroundColor: "#fafafa",
  px: { xs: 2, sm: 3, md: 4 },
  py: 3,
};

const card = {
  border: "2px solid #18181b",
  borderRadius: "24px",
  bgcolor: "#f4f4f5",
  p: 2,
};

const emptyForm = {
  productName: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image: "",
};

export default function DashProductPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const role = String(user?.role || "").toLowerCase();

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetchProducts();

      console.log("PRODUCT RESPONSE:", response);
      console.log(
        "PRODUCT RESPONSE DATA:",
        response?.data
      );

      const productData = response?.data?.products;

      console.log(
        "PRODUCTS:",
        productData
      );

      if (Array.isArray(productData)) {
        setProducts(productData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "ERROR FETCHING PRODUCTS:",
        error
      );

      console.error(
        "SERVER ERROR:",
        error?.response?.data
      );

      setProducts([]);

      setError(
        error?.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await fetchCategories();

      console.log(
        "CATEGORY RESPONSE:",
        response?.data
      );

      const data = response?.data;

      let categoryData = [];

      if (Array.isArray(data)) {
        categoryData = data;
      } else if (
        Array.isArray(data?.categories)
      ) {
        categoryData = data.categories;
      } else if (
        Array.isArray(data?.data)
      ) {
        categoryData = data.data;
      } else if (
        Array.isArray(data?.category)
      ) {
        categoryData = data.category;
      }

      console.log(
        "CATEGORIES:",
        categoryData
      );

      setCategories(categoryData);
    } catch (error) {
      console.error(
        "ERROR FETCHING CATEGORIES:",
        error
      );

      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    loadProducts();
    loadCategories();
  }, [user]);

  const handleOpen = (product = null) => {
    setError("");

    if (product) {
      setEditProductId(product._id);

      const categoryId =
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "";

      setFormData({
        productName:
          product.productName || "",

        description:
          product.description || "",

        price:
          product.price ?? "",

        stock:
          product.stock ?? "",

        category:
          categoryId,

        image:
          product.image || "",
      });
    } else {
      setEditProductId(null);
      setFormData(emptyForm);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProductId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError("");

    if (!formData.productName.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Description is required."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setError(
        "Please enter a valid stock."
      );
      return;
    }

    if (!formData.category) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!formData.image.trim()) {
      setError(
        "Product image is required."
      );
      return;
    }

    try {
      const productData = {
        productName:
          formData.productName.trim(),

        description:
          formData.description.trim(),

        price: Number(
          formData.price
        ),

        stock: Number(
          formData.stock
        ),

        category:
          formData.category,

        image:
          formData.image.trim(),
      };

      console.log(
        "SAVING PRODUCT:",
        productData
      );

      if (editProductId) {
        await updateProduct(
          editProductId,
          productData
        );
      } else {
        await createProduct(
          productData
        );
      }

      await loadProducts();

      handleClose();
    } catch (error) {
      console.error(
        "ERROR SAVING PRODUCT:",
        error
      );

      console.error(
        "SERVER ERROR:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message ||
          "Unable to save product."
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await deleteProduct(id);

      await loadProducts();
    } catch (error) {
      console.error(
        "ERROR DELETING PRODUCT:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  const getCategoryName = (category) => {
    if (!category) {
      return "Uncategorized";
    }

    if (typeof category === "object") {
      return (
        category.categoryName ||
        category.name ||
        "Uncategorized"
      );
    }

    const foundCategory =
      categories.find(
        (item) =>
          String(
            item._id || item.id
          ) === String(category)
      );

    return (
      foundCategory?.categoryName ||
      "Uncategorized"
    );
  };

  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1.4,
      minWidth: 180,
    },

    {
      field: "description",
      headerName: "Description",
      flex: 1.7,
      minWidth: 220,

      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.78rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {params.row.description ||
            "No description"}
        </Typography>
      ),
    },

    {
      field: "price",
      headerName: "Price",
      flex: 0.8,
      minWidth: 120,

      renderCell: (params) =>
        `PHP ${Number(
          params.row.price || 0
        ).toFixed(2)}`,
    },

    {
      field: "stock",
      headerName: "Stock",
      flex: 0.7,
      minWidth: 100,
      align: "center",
      headerAlign: "center",

      renderCell: (params) =>
        params.row.stock ?? 0,
    },

    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 160,

      renderCell: (params) =>
        getCategoryName(
          params.row.category
        ),
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 170,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              handleOpen(params.row)
            }
            sx={{
              borderColor:
                "#18181b",
              color: "#18181b",
            }}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() =>
              handleDelete(
                params.row._id
              )
            }
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  if (
    !["admin", "seller"].includes(
      role
    )
  ) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          Only administrators and sellers can access.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box sx={section}>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 3,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.75rem",
                    md: "1.9rem",
                  },
                  fontWeight: 700,
                  color: "#18181b",
                }}
              >
                Products
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.85rem",
                  color: "#71717a",
                }}
              >
                Manage products
                available in the
                store.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() =>
                handleOpen()
              }
              sx={{
                backgroundColor:
                  "#18181b",

                "&:hover": {
                  backgroundColor:
                    "#27272a",
                },
              }}
            >
              + Add Product
            </Button>
          </Box>

          {error && !open && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius:
                  "12px",
                backgroundColor:
                  "#fee2e2",
                border:
                  "1px solid #ef4444",
              }}
            >
              <Typography
                sx={{
                  color: "#b91c1c",
                  fontSize:
                    "0.85rem",
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <Paper
            elevation={0}
            sx={card}
          >
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) =>
                row._id
              }
              loading={loading}
              pageSizeOptions={[
                10,
                20,
                50,
              ]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                border: "none",
                borderRadius:
                  "18px",
                overflow: "hidden",
                fontSize:
                  "0.78rem",

                "& .MuiDataGrid-columnHeaders":
                  {
                    backgroundColor:
                      "#e4e4e7",
                  },

                "& .MuiDataGrid-cell":
                  {
                    borderBottom:
                      "1px solid #e4e4e7",
                  },

                "& .MuiDataGrid-columnHeader":
                  {
                    fontWeight: 700,
                  },
              }}
            />
          </Paper>

          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              {editProductId
                ? "Edit Product"
                : "Add Product"}
            </DialogTitle>

            <DialogContent
              dividers
            >
              {error && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius:
                      "10px",
                    backgroundColor:
                      "#fee2e2",
                    border:
                      "1px solid #ef4444",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        "#b91c1c",
                      fontSize:
                        "0.8rem",
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}

              <Stack
                spacing={2}
                sx={{ pt: 1 }}
              >
                <TextField
                  fullWidth
                  name="productName"
                  label="Product Name"
                  value={
                    formData.productName
                  }
                  onChange={
                    handleChange
                  }
                />

                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                />

                <TextField
                  fullWidth
                  name="price"
                  type="number"
                  label="Price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />

                <TextField
                  fullWidth
                  name="stock"
                  type="number"
                  label="Stock Quantity"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 0,
                    step: 1,
                  }}
                />

                <TextField
                  select
                  fullWidth
                  name="category"
                  label="Category"
                  value={
                    formData.category ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    categoryLoading
                  }
                  helperText={
                    categoryLoading
                      ? "Loading categories..."
                      : categories.length ===
                        0
                      ? "No categories available"
                      : ""
                  }
                >
                  {categories.map(
                    (category) => {
                      const categoryId =
                        category._id ||
                        category.id;

                      return (
                        <MenuItem
                          key={
                            categoryId
                          }
                          value={
                            categoryId
                          }
                        >
                          {
                            category.categoryName
                          }
                        </MenuItem>
                      );
                    }
                  )}
                </TextField>

               <TextField
  fullWidth
  name="image"
  label="Product Image URL"
  value={formData.image}
  onChange={handleChange}
  placeholder="https://example.com/product-image.jpg"
/>

{formData.image && (
  <Box
    sx={{
      mt: 1,
      p: 2,
      border: "1px solid #d4d4d8",
      borderRadius: "12px",
      backgroundColor: "#fff",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.8rem",
        fontWeight: 600,
        mb: 1,
      }}
    >
      Image Preview
    </Typography>

    <Box
      component="img"
      src={formData.image}
      alt="Product preview"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
      sx={{
        width: 150,
        height: 150,
        objectFit: "cover",
        borderRadius: "10px",
        border: "1px solid #18181b",
      }}
    />
  </Box>
)}
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={
                  handleClose
                }
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={
                  handleSave
                }
                sx={{
                  backgroundColor:
                    "#18181b",

                  "&:hover": {
                    backgroundColor:
                      "#27272a",
                  },
                }}
              >
                {editProductId
                  ? "Update"
                  : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}