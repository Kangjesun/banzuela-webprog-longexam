import { useEffect, useMemo, useState } from "react";

import {
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../../context/AuthContext";

import {
  fetchDashboardOrders,
  updateOrderStatus,
} from "../../services/OrderService";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const section = {
  borderTop: "2px solid #18181b",
  borderBottom: "2px solid #18181b",
  backgroundColor: "#fafafa",
  px: {
    xs: 2,
    sm: 3,
    md: 4,
  },
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

const DashOrdersPage = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    if (
      user.role !== "admin" &&
      user.role !== "seller"
    ) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userId = user.id || user._id;

      const response = await fetchDashboardOrders({
        role: user.role,

        ...(user.role === "seller"
          ? {
              sellerId: userId,
            }
          : {}),

        limit: 100,
      });

      const responseData = response?.data;

      const loadedOrders =
        responseData?.orders ||
        responseData?.data ||
        [];

      setOrders(
        Array.isArray(loadedOrders)
          ? loadedOrders
          : []
      );
    } catch (error) {
      console.error(
        "ERROR LOADING DASHBOARD ORDERS:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) {
      return orders;
    }

    const selectedStatus =
      String(statusFilter)
        .trim()
        .toLowerCase();

    return orders.filter((order) => {
      const orderStatus =
        order.status ||
        order.orderStatus ||
        "";

      return (
        String(orderStatus)
          .trim()
          .toLowerCase() ===
        selectedStatus
      );
    });
  }, [orders, statusFilter]);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      await updateOrderStatus(
        orderId,
        newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) => {
          if (order._id !== orderId) {
            return order;
          }

          return {
            ...order,
            status: newStatus,
            orderStatus: newStatus,
          };
        })
      );

      await loadOrders();
    } catch (error) {
      console.error(
        "ERROR UPDATING ORDER:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );
    }
  };

  const getOrderStatus = (order) => {
    return (
      order?.status ||
      order?.orderStatus ||
      "Pending"
    );
  };

  const columns = [
    {
      field: "_id",
      headerName: "Order",
      flex: 0.7,
      minWidth: 110,

      valueGetter: (value) =>
        `#${String(value || "").slice(-8)}`,
    },

    {
      field: "user",
      headerName: "Customer",
      flex: 1,
      minWidth: 160,

      valueGetter: (_, row) => {
        const firstName =
          row.user?.firstName || "";

        const lastName =
          row.user?.lastName || "";

        const fullName =
          `${firstName} ${lastName}`.trim();

        return (
          fullName ||
          "Unknown Customer"
        );
      },

      renderCell: (params) => {
        const firstName =
          params.row.user?.firstName || "";

        const lastName =
          params.row.user?.lastName || "";

        const fullName =
          `${firstName} ${lastName}`.trim();

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              {fullName ||
                "Unknown Customer"}
            </Typography>

            {params.row.user?.email && (
              <Typography
                variant="caption"
                sx={{
                  color: "#71717a",
                }}
              >
                {params.row.user.email}
              </Typography>
            )}
          </Box>
        );
      },
    },

    {
      field: "items",
      headerName: "Products",
      flex: 1.5,
      minWidth: 230,

      renderCell: (params) => {
        const items =
          params.row.items || [];

        if (!items.length) {
          return (
            <Typography
              variant="body2"
              sx={{
                color: "#71717a",
              }}
            >
              No products
            </Typography>
          );
        }

        return (
          <Box
            sx={{
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              lineHeight: 1.3,
              py: 1,
              width: "100%",
            }}
          >
            {items.map((item, index) => {
              const productName =
                item.product?.productName ||
                item.product?.name ||
                "Unavailable Product";

              return (
                <Typography
                  key={
                    item.product?._id ||
                    index
                  }
                  variant="body2"
                  sx={{
                    lineHeight: 1.4,
                  }}
                >
                  {productName} x
                  {item.quantity}
                </Typography>
              );
            })}
          </Box>
        );
      },
    },

    {
      field: "totalAmount",
      headerName: "Total",
      flex: 0.8,
      minWidth: 120,

      valueFormatter: (value) =>
        `PHP ${Number(value || 0).toFixed(2)}`,
    },

    {
      field: "paymentMethod",
      headerName: "Payment",
      flex: 0.9,
      minWidth: 140,

      valueGetter: (_, row) =>
        row.paymentMethod ||
        row.payment ||
        "—",
    },

    {
      field: "shippingAddress",
      headerName: "Address",
      flex: 1.3,
      minWidth: 190,

      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            lineHeight: 1.3,
            py: 1,
            width: "100%",
          }}
        >
          {params.value ||
            params.row.address ||
            "No address"}
        </Box>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,

      renderCell: (params) => {
        const currentStatus =
          getOrderStatus(params.row);

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <TextField
              select
              size="small"
              value={currentStatus}
              onChange={(event) =>
                handleStatusChange(
                  params.row._id,
                  event.target.value
                )
              }
              fullWidth
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      },
    },

    {
      field: "orderDate",
      headerName: "Date",
      flex: 0.9,
      minWidth: 130,

      valueGetter: (_, row) =>
        row.orderDate ||
        row.createdAt ||
        row.date ||
        null,

      valueFormatter: (value) => {
        if (!value) {
          return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return "—";
        }

        return date.toLocaleDateString(
          "en-PH",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
      },
    },
  ];

  if (
    !user ||
    !["admin", "seller"].includes(
      user.role
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
        <Box sx={container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
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
                  lineHeight: 1.1,
                }}
              >
                Orders
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.8rem",
                  color: "#71717a",
                }}
              >
                {user.role === "admin"
                  ? "All customer orders"
                  : "Orders containing your products"}
              </Typography>
            </Box>
          </Box>

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
              select
              size="small"
              label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              sx={{
                minWidth: 200,
              }}
            >
              <MenuItem value="">
                All statuses
              </MenuItem>

              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#71717a",
                }}
              >
                Showing{" "}
                <strong>
                  {filteredOrders.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {orders.length}
                </strong>{" "}
                orders
              </Typography>
            </Box>
          </Stack>

          <Paper
            elevation={0}
            sx={card}
          >
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              getRowId={(row) => row._id}
              getRowHeight={() => 70}
              loading={loading}
              pageSizeOptions={[10, 20, 50]}
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
                borderRadius: "18px",
                overflow: "hidden",
                fontSize: "0.78rem",

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#e4e4e7",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom:
                    "1px solid #e4e4e7",
                },

                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                  {
                    outline: "none",
                  },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#fafafa",
                },
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashOrdersPage;