import { TextsmsTwoTone } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRecoilState } from "recoil";

export default function TopBar()
{
      return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      );
}