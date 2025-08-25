import { Box, Flex, Button } from "@radix-ui/themes";
import { Outlet, Link } from "react-router-dom";

function Navbar() {
  return (
    <Box asChild>
      <nav>
        <Flex align="center" justify="between" p="5">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>

          <Flex align="center" gap="2">
            <Button asChild variant="solid">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="solid">
              <Link to="/signup">Sign up</Link>
            </Button>
          </Flex>
        </Flex>
        <Outlet />
      </nav>
    </Box>
  );
}
export default Navbar;
