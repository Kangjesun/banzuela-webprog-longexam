import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { useAuth } from "../../context/AuthContext";
import { fetchProducts } from "../../services/ProductService";
import { fetchDashboardOrders } from "../../services/OrderService";
import { fetchAllReviews } from "../../services/ReviewService";
import { fetchUsers } from "../../services/UserService";

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

const statCard = {
  height: "100%",
  border: "2px solid #1e3a8a",
  borderRadius: "24px",
  backgroundColor: "#1e3a8a",
  boxShadow: "none",
};

const iconBox = {
  width: 48,
  height: 48,
  borderRadius: "14px",
  backgroundColor: "#ffd41d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const DashboardPage = () => {
  const { user } = useAuth();

  const role = String(user?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isSeller = role === "seller";
  const userId = user?.id || user?._id;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [
        productsResponse,
        ordersResponse,
        reviewsResponse,
        usersResponse,
      ] = await Promise.all([
        fetchProducts(),
        fetchDashboardOrders(user.role, userId, {
          limit: 100,
        }),
        fetchAllReviews(),
        isAdmin
          ? fetchUsers()
          : Promise.resolve({
              data: { data: [] },
            }),
      ]);

      const productData =
        productsResponse?.data?.data ||
        productsResponse?.data?.products ||
        [];

      const orderData =
        ordersResponse?.data?.data ||
        ordersResponse?.data?.orders ||
        [];

      const reviewData =
        reviewsResponse?.data?.data ||
        reviewsResponse?.data?.reviews ||
        [];

      const userData =
        usersResponse?.data?.data ||
        usersResponse?.data?.users ||
        [];

      setProducts(
        Array.isArray(productData) ? productData : []
      );

      setOrders(
        Array.isArray(orderData) ? orderData : []
      );

      setReviews(
        Array.isArray(reviewData) ? reviewData : []
      );

      setUsers(
        Array.isArray(userData) ? userData : []
      );
    } catch (error) {
      console.error("Error loading dashboard:", error);

      setProducts([]);
      setOrders([]);
      setReviews([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user, role, userId]);

  const totalProducts = products.length;

  const totalStock = useMemo(() => {
    return products.reduce(
      (total, product) =>
        total +
        Number(
          product.stockQuantity ??
            product.stock ??
            0
        ),
      0
    );
  }, [products]);

  const totalOrders = orders.length;

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        String(
          order.status ||
            order.orderStatus ||
            ""
        ).toLowerCase() === "pending"
    ).length;
  }, [orders]);

  const processingOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        String(
          order.status ||
            order.orderStatus ||
            ""
        ).toLowerCase() === "processing"
    ).length;
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = String(
        order.status ||
          order.orderStatus ||
          ""
      ).toLowerCase();

      return (
        status === "shipped" ||
        status === "ready" ||
        status === "ready for claiming"
      );
    }).length;
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        String(
          order.status ||
            order.orderStatus ||
            ""
        ).toLowerCase() === "delivered"
    ).length;
  }, [orders]);

  const totalSales = useMemo(() => {
    return orders
      .filter(
        (order) =>
          String(
            order.status ||
              order.orderStatus ||
              ""
          ).toLowerCase() !== "cancelled"
      )
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );
  }, [orders]);

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const totalRating = reviews.reduce(
      (total, review) =>
        total + Number(review.rating || 0),
      0
    );

    return totalRating / reviews.length;
  }, [reviews]);

  const totalUsers = users.length;

  const activeUsers = useMemo(() => {
    return users.filter(
      (item) => Boolean(item.isActive)
    ).length;
  }, [users]);

  const inactiveUsers = useMemo(() => {
    return users.filter(
      (item) => !Boolean(item.isActive)
    ).length;
  }, [users]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(
          a.orderDate ||
            a.createdAt ||
            0
        );

        const dateB = new Date(
          b.orderDate ||
            b.createdAt ||
            0
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getCustomerName = (order) => {
    const customer =
      order.customer || order.user;

    if (!customer) {
      return "Unknown Customer";
    }

    if (typeof customer === "string") {
      return customer;
    }

    return (
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim() ||
      customer.email ||
      "Unknown Customer"
    );
  };

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
  }) => (
    <Card sx={statCard}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box sx={iconBox}>{icon}</Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fafafa",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "1.7rem",
                fontWeight: 800,
                color: "#facc15",
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.75rem",
                  color: "#fafafa",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

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

  if (!isAdmin && !isSeller) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          Only administrators and sellers can
          access the dashboard.
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
          <Typography
            sx={{
              fontSize: {
                xs: "1.75rem",
                md: "2rem",
              },
              fontWeight: 800,
              color: "#18181b",
              lineHeight: 1.1,
            }}
          >
            Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: "0.9rem",
              color: "#71717a",
            }}
          >
            Welcome back,{" "}
            {user.firstName || "User"}. Here's an
            overview of your store.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            minHeight: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress
              sx={{ color: "#18181b" }}
            />

            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#71717a",
              }}
            >
              Loading dashboard data...
            </Typography>
          </Stack>
        </Box>
      ) : (
        <>
          <Box sx={section}>
            <Box sx={container}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#18181b",
                }}
              >
                Store Overview
              </Typography>

              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <StatCard
                    icon={<InventoryIcon />}
                    title="Products"
                    value={totalProducts}
                    subtitle={`${totalStock} total stock`}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <StatCard
                    icon={<ShoppingBagIcon />}
                    title="Orders"
                    value={totalOrders}
                    subtitle={`${pendingOrders} pending`}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <StatCard
                    icon={<RateReviewIcon />}
                    title="Reviews"
                    value={totalReviews}
                    subtitle={`${averageRating.toFixed(
                      1
                    )} average rating`}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <StatCard
                    icon={<AttachMoneyIcon />}
                    title="Sales"
                    value={`PHP ${totalSales.toLocaleString(
                      "en-PH",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}`}
                    subtitle="From loaded orders"
                  />
                </Grid>

                {isAdmin && (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <StatCard
                      icon={<PeopleIcon />}
                      title="Users"
                      value={totalUsers}
                      subtitle={`${activeUsers} active`}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>

          <Box sx={section}>
            <Box sx={container}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#18181b",
                }}
              >
                Order Summary
              </Typography>

              <Grid container spacing={2}>
                {[
                  {
                    icon: <PendingActionsIcon />,
                    title: "Pending",
                    value: pendingOrders,
                  },
                  {
                    icon: <ShoppingBagIcon />,
                    title: "Processing",
                    value: processingOrders,
                  },
                  {
                    icon: <CheckCircleIcon />,
                    title: "Ready / Claiming",
                    value: readyOrders,
                  },
                  {
                    icon: <CheckCircleIcon />,
                    title: "Completed",
                    value: completedOrders,
                  },
                ].map((item) => (
                  <Grid
                    key={item.title}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    <Card sx={statCard}>
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              color: "#facc15",
                            }}
                          >
                            {item.icon}
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: "#fafafa",
                              }}
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                color: "#facc15",
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          <Box sx={section}>
            <Box sx={container}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#18181b",
                }}
              >
                Recent Orders
              </Typography>

              <Card sx={statCard}>
                <CardContent sx={{ p: 0 }}>
                  {recentOrders.length === 0 ? (
                    <Box sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          color: "#fafafa",
                          textAlign: "center",
                        }}
                      >
                        No orders found.
                      </Typography>
                    </Box>
                  ) : (
                    recentOrders.map(
                      (order, index) => (
                        <Box key={order._id}>
                          <Box
                            sx={{
                              px: 2.5,
                              py: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "space-between",
                              gap: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                  color: "#facc15",
                                }}
                              >
                                #
                                {String(
                                  order._id
                                ).slice(-8)}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.3,
                                  fontSize: "0.75rem",
                                  color: "#fafafa",
                                }}
                              >
                                {getCustomerName(
                                  order
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                textAlign: "right",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                  color: "#facc15",
                                }}
                              >
                                PHP{" "}
                                {Number(
                                  order.totalAmount ||
                                    0
                                ).toLocaleString(
                                  "en-PH",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.3,
                                  fontSize: "0.72rem",
                                  color: "#fafafa",
                                }}
                              >
                                {formatStatus(
                                  order.status ||
                                    order.orderStatus
                                )}
                              </Typography>
                            </Box>
                          </Box>

                          {index <
                            recentOrders.length -
                              1 && <Divider />}
                        </Box>
                      )
                    )
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {isAdmin && (
            <Box sx={section}>
              <Box sx={container}>
                <Typography
                  sx={{
                    mb: 2,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#18181b",
                  }}
                >
                  User Management Summary
                </Typography>

                <Grid container spacing={2}>
                  {[
                    {
                      title: "Total Users",
                      value: totalUsers,
                    },
                    {
                      title: "Active Users",
                      value: activeUsers,
                    },
                    {
                      title: "Inactive Users",
                      value: inactiveUsers,
                    },
                  ].map((item) => (
                    <Grid
                      key={item.title}
                      size={{
                        xs: 12,
                        sm: 4,
                      }}
                    >
                      <Card sx={statCard}>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#fafafa",
                            }}
                          >
                            {item.title}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: "1.7rem",
                              fontWeight: 800,
                              color: "#facc15",
                            }}
                          >
                            {item.value}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
