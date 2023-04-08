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

export default function Signup() {
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
      const resopnse = await axios.post(`${process.env.END_POINT}/api/user`, values);
      const data = resopnse.data;
      console.log(data);
      if(data) {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log(data);
        navigate("/chats");

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
         <FormControl isInvalid={errors.firstName}>
              <FormLabel htmlFor='firstName'>First Name</FormLabel>
              <Input
                id='firstName'
                placeholder='first name'
                {...register('firstName', {
                     required: 'This is required',
                     minLength: { value: 4, message: 'Minimum length should be 4' },
                })}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
         </FormControl>

         <FormControl isInvalid={errors.lastName}>
              <FormLabel htmlFor='lastName'>Last Name</FormLabel>
              <Input
                id='lastName'
                placeholder='Last Name'
                {...register('lastName', {
                     required: 'This is required',
                     minLength: { value: 2, message: 'Minimum length should be 2' },
                })}
              />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
         </FormControl>

         <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor='lastName'>Email Name</FormLabel>
              <Input
                id='email'
                placeholder="Email"
                {...register('email', {
                     required: 'Email is required',
                     pattern: {
                       value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                       message: 'Please enter a valid email',
                     },
                })}
                type="email"
                
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
         </FormControl>

         <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                id='password'
                placeholder="Password"
                {...register("password", {
                     required: true,
                     minLength: { value: 4, message: 'Minimum length should be 4' },
                 })
                }
                
                type="password"
                
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
         </FormControl>

         <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                id='confirmPassword'
                placeholder="Password"
                {...register("confirmPassword", {
                     required: true,
                     validate: (val) => {
                       if (watch('password') != val) {
                            return "Your passwords do no match";
                       }
                     },
                 })
                }
                type="password"
                
              />
              <FormErrorMessage>
                {errors.confirmPassword && errors.confirmPassword.message}
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