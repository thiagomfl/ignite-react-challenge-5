import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  id: string;
  ts: number;
  url: string;
  title: string;
  description: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [urlImg, setUrlImg] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleViewImage(url: string): void {
    setUrlImg(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid column={3} spacing={10}>
        {cards.map(data => (
          <Card
            data={data}
            key={data.id}
            viewImage={() => handleViewImage(data.url)}
          />
        ))}
      </SimpleGrid>
      {urlImg && (
        <ModalViewImage isOpen={isOpen} imgUrl={urlImg} onClose={onClose} />
      )}
    </>
  );
}
