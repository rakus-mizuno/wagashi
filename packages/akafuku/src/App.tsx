import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC } from 'react';
import { Container } from './components/container/Container';
import { Content } from './components/content/Content';

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Content></Content>
      </Container>
    </QueryClientProvider>
  );
};
