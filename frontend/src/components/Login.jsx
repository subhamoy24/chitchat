import { useForm } from 'react-hook-form'
import { Link, useNavigate } from "react-router-dom"

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Heading,
  Container,
  useToast,
  Flex,
  Box
} from '@chakra-ui/react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function Login() {
  const logged_user = useSelector((state) => state.user.value)

  const {
       handleSubmit,
       register,
       watch,
       formState: { errors, isSubmitting },
  } = useForm()
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if(logged_user) {
      navigate("/dashboard");
    }

  }, [])


  async function onSubmit(values) {
    try {
      console.log(`${process.env.REACT_APP_END_POINT}/api/user/login`);
      const resopnse = await axios.post(`${process.env.REACT_APP_END_POINT}/api/user/login`, values);
      const data = resopnse.data;
      console.log(data);
      if(data) {
    
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log(data);
        navigate("/dashboard");

      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }
  console.log(`${process.env.REACT_APP_END_POINT}`)

  return (
    <Box bg="aqua" h="100vh">
    <Container h="100%">
    <Flex h="100%" justifyContent="center" alignItems="center" flexDirection="column">
    <Card maxW='md' marginTop="10" width="100%">
      <CardHeader>
        <Heading size="md" textAlign="center">Signup</Heading>
      </CardHeader>
      <Divider/>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor='email'>Email Name</FormLabel>
              <Input
                id='email'
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                
                })}
                type="email"
                
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                id='password'
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                
                })}
                type="password"
                
              />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>

    <Flex>
      <p>Not signup yet - &gt;</p>
      <Link to="/signup">sign up</Link>
    </Flex>
    </Flex>
  </Container>
  </Box>
  )
}