import { Button, ButtonProps, CircularProgress } from "@mui/material";

type ExtendedMuiButtonProps = {
  loading?: boolean;
} & ButtonProps;

const MuiButton = ({ loading, ...buttonProps }: ExtendedMuiButtonProps) => {
  return (
    <Button
      {...buttonProps}
      onClick={(e) => {
        if (!loading) {
          buttonProps.onClick?.(e);
        }
      }}
    >
      {!loading && buttonProps.children}
      {loading && (
        <CircularProgress
          sx={{
            "&.MuiCircularProgress-colorPrimary": {
              color: "white",
            },
          }}
          size={24}
        />
      )}
    </Button>
  );
};

export default MuiButton;
