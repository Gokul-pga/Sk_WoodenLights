import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Divider,
  Fade,
  Backdrop
} from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "50%" },
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden", // Ensures image corners match modal radius
  outline: "none",
};

const EnquiryModal = ({ open, onClose, product, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const increaseQty = () => {
    setForm((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decreaseQty = () => {
    setForm((prev) => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));
  };
  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      quantity: 1,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // safety guard
    setIsSubmitting(true);
    const payload = {
      access_key: "310dd7ba-767d-4b79-a344-d7f7a607790b",
  
      name: form.name,
      phone: form.phone,
      email: form.email,
  
      subject: `New Product Enquiry – ${product.identifier}`,
  
      message: `
  Product: ${product.identifier}
  Price: ₹${product.sellingPrice}
  Quantity: ${form.quantity}
  Total: ₹${product.sellingPrice * form.quantity}
  
  Category: ${product.category?.identifier}
  Subcategory: ${product.subcategory?.identifier}
      `.trim(),
  
      // Optional extras
      product_name: product.identifier,
      product_price: product.sellingPrice,
      product_quantity: form.quantity,
      product_image: product.images?.[0],
    };
  
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (data.success) {
        toast.success("Enquiry sent successfully!", {
        });
        resetForm();
        setTimeout(() => {
          onClose();
        }, 800); // allow toast to render
      }
       else {
        toast.error("Failed to send enquiry");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const totalPrice = product.sellingPrice * form.quantity;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
        },
      }}
    >
      
      <Fade in={open}>
        <Box sx={style}>
       
          {/* Header Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#fff" }, zIndex: 1 }}
          >
            <Close fontSize="small" />
          </IconButton>

          {/* Product Header */}
          <div className="relative p-2 w-full items-center justify-center flex flex-row" >
            <img
              src={product.images?.[0]}
              alt={product.identifier}
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              {product.identifier}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Price: <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>${product.sellingPrice}</Box>
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="standard"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  variant="standard"
                  label="Phone Number"
                  name="phone"
                  type="number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  variant="standard"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                {/* Quantity Selector */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f9f9f9",
                    p: 1,
                    px: 2,
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="600" fontSize={18}>Quantity</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <IconButton 
                        size="small" 
                        onClick={decreaseQty} 
                        sx={{ border: "1px solid #ddd", bgcolor: "#fff" }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography fontWeight="700">{form.quantity}</Typography>
                    <IconButton 
                        size="small" 
                        onClick={increaseQty} 
                        sx={{ border: "1px solid #ddd", bgcolor: "#fff" }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
{/* Final Price */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 1,
    px: 1,
  }}
>
  <Typography variant="body2" color="text.secondary">
    Total Price
  </Typography>

  <Typography
  key={totalPrice}
  variant="body1"
  fontWeight={700}
  sx={{ color: "primary.main", transition: "all 0.2s ease" }}
>
  ₹{totalPrice}
</Typography>

</Box>

                {/* Actions */}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={onClose}
                    sx={{ color: "text.secondary", fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                  <Button
  fullWidth
  variant="contained"
  type="submit"
  disabled={isSubmitting}
  disableElevation
  sx={{
    borderRadius: 2,
    py: 1.2,
    fontWeight: 700,
    textTransform: "none",
    fontSize: "1rem",
    bgcolor: "#A52A2A",
    position: "relative",
  }}
>
  {isSubmitting ? (
    <CircularProgress size={24} sx={{ color: "#fff" }} />
  ) : (
    "Send Enquiry"
  )}
</Button>

                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EnquiryModal;