import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Box, Button, Stack, useToast } from '@chakra-ui/react';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type FormImageProps = {
  url: string;
  title: string;
  image: FileList;
  description: string;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');

  const toast = useToast();

  const regex = new RegExp(/\.(jpeg|jpg|png|gif)$/i);

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: file =>
          file[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: file =>
          regex.test(file[0].name) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: FormImageProps) => api.post('/api/images', payload),
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: FormImageProps): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          isClosable: true,
          title: 'Imagem não enviada',
        });

        return;
      }

      mutation.mutate(data);

      toast({
        status: 'success',
        title: 'Imagem enviada com sucesso',
      });
    } catch {
      toast({
        title: 'Erro ao enviar a imagem',
        status: 'error',
        isClosable: true,
      });
    } finally {
      reset();
      closeModal();
      setImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          trigger={trigger}
          setError={setError}
          error={errors.image}
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          {...register('image', formValidations.image)}
        />

        <TextInput
          error={errors.title}
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
        />

        <TextInput
          error={errors.description}
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        py={6}
        w="100%"
        type="submit"
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
      >
        Enviar
      </Button>
    </Box>
  );
}
