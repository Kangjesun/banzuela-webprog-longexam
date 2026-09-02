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
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../../context/AuthContext";

import {
  fetchAllReviews,
  updateReview,
} from "../../services/ReviewService";

import productImages from "../../assets/ProductImages.js";

const section = {
  borderTop: "2px solid #18181b",
  borderBottom: "2px solid #18181b",
  backgroundColor: "#fafafa",
  px: { xs: 2, sm: 3, md: 4 },
  py: 3,
};

const container = {
  width: "100%",
};

const card = {
  border: "2px solid #18181b",
  borderRadius: "24px",
  bgcolor: "#f4f4f5",
  p: 2,
};

const placeholderImage =
  "https://placehold.co/64x64?text=No+Image";

const DashReviewsPage = () => {
  const { user } = useAuth();

  const role = String(user?.role || "").toLowerCase();
  const isAdmin = role === "admin";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [open, setOpen] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });

  const [errors, setErrors] = useState({});

  const loadReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetchAllReviews();

      const reviewData =
        response?.data?.data ||
        response?.data?.reviews ||
        [];

      setReviews(
        Array.isArray(reviewData)
          ? reviewData
          : []
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
      console.error(
        "Review response:",
        error?.response?.data
      );
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user &&
      ["admin", "seller"].includes(role)
    ) {
      loadReviews();
    }
  }, [user, role]);

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

  const filteredReviews = reviews
    .filter((review) => {
      const productName =
        typeof review.product === "object"
          ? review.product?.productName || ""
          : "";

      const reviewerName =
        typeof review.reviewer === "object"
          ? `${review.reviewer?.firstName || ""} ${
              review.reviewer?.lastName || ""
            }`.trim()
          : "";

      return `${productName} ${
        review.comment || ""
      } ${reviewerName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === "highest") {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      }

      if (sortOrder === "lowest") {
        return (
          Number(a.rating || 0) -
          Number(b.rating || 0)
        );
      }

      return 0;
    });

  const getProductImage = (product) => {
    if (!product) return placeholderImage;

    const imageKey =
      product.image ||
      product.productImage ||
      product.imageName;

    if (!imageKey) return placeholderImage;

    if (productImages[imageKey]) {
      return productImages[imageKey];
    }

    if (
      typeof imageKey === "string" &&
      (
        imageKey.startsWith("http://") ||
        imageKey.startsWith("https://")
      )
    ) {
      return imageKey;
    }

    return placeholderImage;
  };

  const handleEdit = (id) => {
    const review = reviews.find(
      (item) => item._id === id
    );

    if (!review) return;

    setEditForm({
      rating: review.rating ?? 5,
      comment: review.comment || "",
    });

    setEditReviewId(id);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditReviewId(null);
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};

    if (
      !editForm.rating ||
      Number(editForm.rating) < 1 ||
      Number(editForm.rating) > 5
    ) {
      nextErrors.rating =
        "Rating must be between 1 and 5";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveReview = async () => {
    if (!validate()) return;

    try {
      await updateReview(editReviewId, {
        rating: Number(editForm.rating),
        comment: editForm.comment,
      });

      await loadReviews();
      handleClose();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const columns = [
    {
      field: "product",
      headerName: "Product",
      flex: 1.4,
      minWidth: 220,

      valueGetter: (_, row) =>
        row.product?.productName ||
        "Unknown Product",

      renderCell: (params) => {
        const product = params.row.product;

        const productName =
          product?.productName ||
          "Unknown Product";

        const productImageSrc =
          getProductImage(product);

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              component="img"
              src={productImageSrc}
              alt={productName}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  placeholderImage;
              }}
              sx={{
                width: 42,
                height: 42,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid #18181b",
                flexShrink: 0,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {productName}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "rating",
      headerName: "Rating",
      flex: 0.9,
      minWidth: 150,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Rating
            value={Number(
              params.row.rating || 0
            )}
            precision={0.5}
            readOnly
            size="small"
          />
        </Box>
      ),
    },

    {
      field: "comment",
      headerName: "Comment",
      flex: 1.6,
      minWidth: 240,

      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.4,
          }}
        >
          {params.row.comment || "—"}
        </Typography>
      ),
    },

    {
      field: "reviewer",
      headerName: "Reviewer",
      flex: 1,
      minWidth: 160,

      valueGetter: (_, row) =>
        row.reviewer
          ? `${row.reviewer.firstName || ""} ${
              row.reviewer.lastName || ""
            }`.trim() || "Unknown Reviewer"
          : "Unknown Reviewer",
    },

    ...(isAdmin
      ? [
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            minWidth: 90,
            headerAlign: "center",
            align: "center",

            renderCell: (params) => (
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  handleEdit(params.row._id)
                }
                sx={{
                  backgroundColor: "#18181b",
                  "&:hover": {
                    backgroundColor: "#27272a",
                  },
                }}
              >
                Edit
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box sx={section}>
        <Box sx={container}>
          <Typography
            sx={{
              mb: 3,
              fontSize: {
                xs: "1.75rem",
                md: "1.9rem",
              },
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.1,
            }}
          >
            Reviews
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              mt: 3,
              pb: 3,
            }}
          >
            <TextField
              size="small"
              label="Search reviews"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              fullWidth
            />

            <TextField
              select
              size="small"
              label="Sort by Rating"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
              sx={{
                minWidth: 200,
              }}
            >
              <MenuItem value="">
                Default
              </MenuItem>

              <MenuItem value="highest">
                Highest to Lowest
              </MenuItem>

              <MenuItem value="lowest">
                Lowest to Highest
              </MenuItem>
            </TextField>
          </Stack>

          <Paper elevation={0} sx={card}>
            <DataGrid
              rows={filteredReviews}
              columns={columns}
              getRowId={(row) => row._id}
              getRowHeight={() => 60}
              loading={loading}
              pageSizeOptions={[10, 20, 50]}
              columnBuffer={10}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                borderRadius: "18px",
                overflow: "hidden",
                fontSize: "0.78rem",

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#e4e4e7",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e4e4e7",
                },

                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                  {
                    outline: "none",
                  },
              }}
            />
          </Paper>

          {isAdmin && (
            <Dialog
              open={open}
              onClose={handleClose}
              fullWidth
              maxWidth="md"
              PaperProps={{
                sx: {
                  borderRadius: "24px",
                  border: "2px solid #18181b",
                  bgcolor: "#fafafa",
                },
              }}
            >
              <DialogTitle sx={{ fontWeight: 700 }}>
                Edit Review
              </DialogTitle>

              <DialogContent
                dividers
                sx={{
                  px: {
                    xs: 2,
                    sm: 3,
                  },
                }}
              >
                <Stack spacing={2} sx={{ pt: 1 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Rating"
                    value={editForm.rating}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        rating: event.target.value,
                      }))
                    }
                    error={!!errors.rating}
                    helperText={errors.rating}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MenuItem
                        key={value}
                        value={value}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Comment"
                    value={editForm.comment}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        comment: event.target.value,
                      }))
                    }
                    multiline
                    rows={4}
                  />
                </Stack>
              </DialogContent>

              <DialogActions
                sx={{
                  px: 3,
                  py: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    color: "#18181b",
                    borderColor: "#18181b",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSaveReview}
                  sx={{
                    backgroundColor: "#18181b",
                    "&:hover": {
                      backgroundColor: "#27272a",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashReviewsPage;
