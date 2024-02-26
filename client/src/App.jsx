import React, { useState } from 'react';
import axios from 'axios';

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
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const App = () => {

  const [originalURL, setOriginalURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [shortURLCode, setShortURLCode] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const shortenURL = async () => {
    try {
      const response = await axios.post('http://localhost:5000/shorten', { originalURL }, { withCredentials: true })
      console.log(response)
      setShortURL(`${window.location.origin}/${response.data.shortURLCode}`);
      setShortURLCode(response.data.shortURLCode)
      setClickCount(response.data.clicks);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  }

  const handleShortUrlClick = async () => {
    try {
      await axios.get(`http://localhost:5000/${shortURLCode}`,{ withCredentials: true });
      setClickCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error redirecting to URL:', error);
    }
  };

  return (
    <Container maxW="5xl" p={{ base: 5, md: 10 }}>
      <Stack spacing={4} maxW={{ base: '20rem', sm: '25rem' }} margin="0 auto">
        <Stack align="center" spacing={2}>
          <Heading fontSize={{ base: 'xl', sm: '3xl' }}>Short Your URL Here</Heading>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>Make a magic link with your long URL</Text>
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
            bg={useColorModeValue('white', 'gray.700')}
            rounded="lg"
            boxShadow="lg"
          >
            <FormControl>
              <FormLabel>Your Long URL</FormLabel>
              <Input type="text" placeholder="Paste here" rounded="md" onChange={(e)=>{setOriginalURL(e.target.value)}} />
            </FormControl>
            <Button bg="blue.400" color="white" _hover={{ bg: 'blue.500' }} rounded="md" w="100%" onClick={shortenURL}>
              Make magic link
            </Button>

            {shortURL && <Link href={shortURL} isExternal onClick={handleShortUrlClick}>
              {shortURL} <ExternalLinkIcon mx='2px' />
            </Link>}
            
            {clickCount!=0 && <Text>Click Count: {clickCount}</Text>}
            
          </VStack>
        </Box>
      </Stack>
    </Container>
  );
};

export default App;