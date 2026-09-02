import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Switch,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { fetchUsers, updateUser, createUser } from "../../services/UserService";

const section = {
  borderTop: "2px solid #18181b",
  borderBottom: "2px solid #18181b",
  backgroundColor: "#fafafa",
  px: { xs: 2, sm: 3, md: 4 },
  py: 3,
};

const container = { width: "100%" };

const card = {
  border: "2px solid #18181b",
  borderRadius: "24px",
  bgcolor: "#f4f4f5",
  p: 2,
};

const roles = ["admin", "seller", "customer"];

const labelize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const DashUsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    role: "admin",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""} ${u.username || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole = filterRole ? u.role === filterRole : true;
    const matchesStatus =
      filterStatus === ""
        ? true
        : filterStatus === "active"
          ? u.isActive
          : !u.isActive;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpen = () => {
    setIsEditing(false);
    setEditUserId(null);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      role: "customer",
      isActive: true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditUserId(null);
    setErrors({});
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((item) => item._id === id);

    if (!userToEdit) return;

    setNewUser({
      ...userToEdit,
      password: "",
    });
    setEditUserId(id);
    setIsEditing(true);
    setErrors({});
    setOpen(true);
  };

  const validate = () => {
    const err = {};

    const firstName = newUser.firstName?.trim() || "";
    const lastName = newUser.lastName?.trim() || "";
    const email = newUser.email?.trim() || "";
    const password = newUser.password || "";
    const contact = newUser.contactNumber?.trim() || "";
    const address = newUser.address?.trim() || "";

    if (!firstName) err.firstName = "First name is required";
    if (!lastName) err.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      err.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      err.email = "Enter a valid email address";
    } else {
      const emailExists = users.some((item) => {
        const sameEmail = item.email?.toLowerCase() === email.toLowerCase();
        if (isEditing) return sameEmail && item._id !== editUserId;
        return sameEmail;
      });

      if (emailExists) {
        err.email = "Email address is already in use";
      }
    }

    if (!isEditing) {
      if (!password) {
        err.password = "Password is required";
      } else if (password.length < 8) {
        err.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        err.password = "Must contain at least 1 uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        err.password = "Must contain at least 1 number";
      }
    } else if (password) {
      if (password.length < 8) {
        err.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        err.password = "Must contain at least 1 uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        err.password = "Must contain at least 1 number";
      }
    }

    const phoneRegex = /^09\d{9}$/;
    if (!contact) {
      err.contactNumber = "Contact number is required";
    } else if (!/^\d+$/.test(contact)) {
      err.contactNumber = "Contact number must contain only numbers";
    } else if (contact.length !== 11) {
      err.contactNumber = "Contact number must be exactly 11 digits";
    } else if (!phoneRegex.test(contact)) {
      err.contactNumber = "Must start with 09 (valid PH format)";
    }

    if (!address) {
      err.address = "Address is required";
    } else if (address.length < 5) {
      err.address = "Address seems too short";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validate()) return;

    try {
      const payload = { ...newUser };

      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await updateUser(editUserId, payload);
      } else {
        await createUser(payload);
      }

      await loadUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateUser(id, { isActive: !isActive });
      await loadUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.9,
      minWidth: 120,
      valueGetter: (_, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`.trim(),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 75,
      sortable: true,
    },
    {
      field: "contactNumber",
      headerName: "Contact",
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.9,
      minWidth: 145,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ minWidth: 50, px: 1, backgroundColor: "#18181b" }}
            onClick={() => handleEdit(params.row._id)}
          >
            Edit
          </Button>

          <Switch
            checked={Boolean(params.row.isActive)}
            onChange={() => handleToggleActive(params.row._id, params.row.isActive)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#18181b" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#18181b",
              },
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={section}>
        <Box sx={container}>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.75rem", md: "1.9rem" },
                fontWeight: 700,
                color: "#18181b",
                lineHeight: 1.1,
              }}
            >
              Users
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpen}
              sx={{ width: { xs: "100%", sm: "auto" }, backgroundColor: "#18181b" }}
            >
              Add User
            </Button>
          </Box>

          <Stack spacing={2} sx={{ mt: 3, pb: 3 }}>
            <TextField
              size="small"
              label="Search users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                size="small"
                label="Role"
                value={filterRole}
                onChange={(event) => setFilterRole(event.target.value)}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {labelize(role)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Status"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <Paper elevation={0} sx={card}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row._id}
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
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                  outline: "none",
                },
              }}
            />
          </Paper>

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
              {isEditing ? "Edit User" : "Add User"}
            </DialogTitle>

            <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={(event) =>
                      setNewUser((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Last Name"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={(event) =>
                      setNewUser((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Contact Number"
                    name="contactNumber"
                    value={newUser.contactNumber}
                    onChange={(event) =>
                      setNewUser((prev) => ({
                        ...prev,
                        contactNumber: event.target.value,
                      }))
                    }
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(event) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Role"
                  name="role"
                  value={newUser.role}
                  onChange={(event) =>
                    setNewUser((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {labelize(role)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(event) =>
                    setNewUser((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  name="address"
                  value={newUser.address}
                  onChange={(event) =>
                    setNewUser((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ color: "#18181b", borderColor: "#18181b" }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveUser}
                sx={{ backgroundColor: "#18181b" }}
              >
                {isEditing ? "Save Changes" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default DashUsersPage;