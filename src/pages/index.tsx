import { useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { api } from '../services/api';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { CardList } from '../components/CardList';

type Image = {
  id: string;
  ts: number;
  url: string;
  title: string;
  description: string;
};

type Response = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function getImages({ pageParam = null }): Promise<Response> {
    const { data } = await api.get('/api/images');
    return data;
  }

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery('images', getImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(
    () => (data ? data.pages.map(page => page.data).flat() : []),
    [data]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button bg="yellow.400" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
