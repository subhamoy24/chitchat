import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"

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
  useToast
} from '@chakra-ui/react'
import axios from 'axios'

export default function Login() {
  const {
       handleSubmit,
       register,
       watch,
       formState: { errors, isSubmitting },
  } = useForm()
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(values) {
    try {
      const resopnse = await axios.post(`${process.env.END_POINT}/api/user/login`, values);
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

  return (
    <Container>
    <Card maxW='md' marginTop="10">
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
  </Container>
  )
}