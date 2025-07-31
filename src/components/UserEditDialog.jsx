// components/UserEditDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";

const UserEditDialog = ({ open, user, onClose, onSave, loading, error }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
  });

  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [subscriptionUpdating, setSubscriptionUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "user",
      });
      setSubscriptionActive(user.has_subscription || false); // предполагаем, что есть это поле
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Сначала вызываем основной onSave
      await onSave({
        id: user.id,
        ...formData,
      });

      // Затем отдельный запрос на подписку
      setSubscriptionUpdating(true);
      await fetch(` /api/admin/users/${user.id}/subscription`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ active: subscriptionActive }),
      });

      setSubscriptionUpdating(false);
      onClose(); // Закрываем после обоих запросов
    } catch (err) {
      console.error("Ошибка при сохранении или подписке:", err);
      setSubscriptionUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {user ? "Редактирование пользователя" : "Создание пользователя"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Полное имя"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Роль"
                onChange={handleChange}
              >
                <MenuItem value="user">Пользователь</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={subscriptionActive}
                  onChange={(e) => setSubscriptionActive(e.target.checked)}
                  name="has_subscription"
                  color="primary"
                />
              }
              label="Активная подписка"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || subscriptionUpdating}
        >
          {loading || subscriptionUpdating ? (
            <CircularProgress size={24} />
          ) : (
            "Сохранить"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
