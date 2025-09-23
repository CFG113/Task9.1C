import { Box, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      asChild
      position="fixed"
      left="0"
      right="0"
      bottom="0"
      height="5ex"
      style={{
        backgroundColor: "black",
        color: "white",
        fontSize: "calc(8px + 2vmin)",
      }}
    >
      <footer>
        <Flex align="center" justify="between" p="5">
          <Link to="/about">About Deakin</Link>
          <Link to="/connect">Connect with us</Link>

          <Flex align="center" gap="3">
            <a href="https://www.facebook.com/DeakinUniversity">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/deakinuniversity/">
              <FaInstagram />
            </a>
            <a href="https://twitter.com/deakin">
              <FaTwitter />
            </a>
          </Flex>
        </Flex>
      </footer>
    </Box>
  );
}
