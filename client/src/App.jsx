import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Box,
  FormLabel,
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  VStack,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const App = () => {
  const [originalURL, setOriginalURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [shortURLCode, setShortURLCode] = useState("");
  const [clicks, setClicks] = useState(0);
  const [Data, setData] = useState([]);

  const shortenURL = async () => {
    try {
      if (originalURL.length < 6) {
        alert("Invalid Link");
      } else {
        const response = await axios.post(
          "https://slink1.vercel.app/shorten",
          { originalURL },
          { withCredentials: true }
        );
        setShortURL(`https://slink1.vercel.app/${response.data.shortURLCode}`);
        setShortURLCode(response.data.shortURLCode);
        const newData = {
          shortURL: `https://slink1.vercel.app/${response.data.shortURLCode}`,
          originalURL: originalURL,
          clicks: 0,
        };
        const existingData = JSON.parse(localStorage.getItem("Data")) || [];
        localStorage.setItem(
          "Data",
          JSON.stringify([newData, ...existingData])
        );
      }
    } catch (error) {
      console.error("Error shortening URL:", error.message);
    }
  };

  const getAllData = () => {
    try {
      const data = JSON.parse(localStorage.getItem("Data")) || [];
      setData(data);
      console.log(Data)
      console.log("Data Fetched Successfully");
    } catch (error) {
      console.error("Error in getting data:", error);
    }
  };

  const updateClicks = async () => {
    try {
      const response = await axios.get(
        `https://slink1.vercel.app/get/${shortURLCode}`
      );
      const newClicks = response.data.clicks;
      
      const existingData = JSON.parse(localStorage.getItem("Data")) || [];
      const updatedData = existingData.map((item) => {
        if (item.shortURL === `https://slink1.vercel.app/${response.data.shortURLCode}`) {
          console.log(newClicks)
          return { ...item, clicks: newClicks };
        }
        return item;
      });

      localStorage.setItem("Data", JSON.stringify(updatedData));
      setClicks(newClicks);

      console.log("Clicks Updated");
    } catch (error) {
      console.error("Error in getting data:", error.message);
    }
  };

  useEffect(() => {
    getAllData();
  }, [shortURL]);

  return (
    <>
      <Container maxW="5xl" p={{ base: 5, md: 10 }}>
        <Stack
          spacing={4}
          maxW={{ base: "20rem", sm: "25rem" }}
          margin="0 auto"
        >
          <Stack align="center" spacing={2}>
            <Heading fontSize={{ base: "xl", sm: "3xl" }}>
              Short Your URL Here
            </Heading>
            <Text fontSize={{ base: "sm", sm: "md" }}>
              Make a magic link with your long URL
            </Text>
          </Stack>
          <Box pos="relative">
            <Box
              pos="absolute"
              top="-7px"
              right="-7px"
              bottom="-7px"
              left="-7px"
              rounded="lg"
              bgGradient="linear(to-l, #7928CA,#FF0080)"
              transform="rotate(-2deg)"
            ></Box>
            <VStack
              as="form"
              pos="relative"
              spacing={8}
              p={6}
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              boxShadow="lg"
            >
              <FormControl>
                <FormLabel>Your Long URL</FormLabel>
                <Input
                  type="text"
                  placeholder="Paste here"
                  rounded="md"
                  onChange={(e) => {
                    if (e.target.value == "Enter") {
                      setOriginalURL(e.target.value);
                      shortenURL();
                    }
                    setOriginalURL(e.target.value);
                  }}
                  required
                />
              </FormControl>
              <Button
                bg="blue.400"
                color="white"
                _hover={{ bg: "blue.500" }}
                rounded="md"
                w="100%"
                onClick={shortenURL}
              >
                Make magic link
              </Button>

              {shortURL && (
                <Box textAlign={"left"}>
                  <Box>
                    <b>Your Short Link:</b>
                    <Link
                      onClick={() => {
                        setTimeout(() => {
                          updateClicks();
                          getAllData();
                        }, 3000);
                      }}
                      href={shortURL}
                      isExternal
                    >
                      {shortURL}
                      <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Box>
                  <Text fontWeight="bold">Clicks: {clicks}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        </Stack>
      </Container>

      <Table variant="simple" w="60%" mx="auto" mt={10}>
        <TableCaption>Thank You, Visit Again</TableCaption>
        <Thead>
          <Tr>
            <Th>Long Link</Th>
            <Th>Short Link</Th>
            <Th isNumeric>Clicks</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Data.length !== 0 && Data.map((item, id) => {
            const originalURLSubstring = item.originalURL?.substr(8, 50) || "";
            return (
              <Tr key={id}>
                <Td>
                  <Link href={item.originalURL} isExternal>
                    {originalURLSubstring}
                  </Link>
                </Td>
                <Td>
                  <Link
                    onClick={() => {
                      setTimeout(() => {
                        updateClicks();
                        getAllData();
                      }, 3000);
                    }}
                    href={item.shortURL}
                    isExternal
                  >
                    {item.shortURL.substr(0, 30) || ""}
                  </Link>
                </Td>
                <Td isNumeric>{item.clicks}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

export default App;
