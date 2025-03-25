import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const DeleteButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="error" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Do you want to delete this item?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
