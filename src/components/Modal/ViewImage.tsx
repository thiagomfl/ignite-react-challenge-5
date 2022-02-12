import {
  Link,
  Image,
  Modal,
  ModalFooter,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  imgUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalViewImage({
  isOpen,
  imgUrl,
  onClose,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent bg="gray.600">
        <Image src={imgUrl} />
        <ModalFooter justifyContent="flex-start">
          <Link href={imgUrl} target="_blank">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
