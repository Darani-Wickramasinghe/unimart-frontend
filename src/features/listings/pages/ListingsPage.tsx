import { useState } from 'react';
import {
  Container,
  TextField,
  Grid,
  Typography,
  Alert,
  Pagination,
  Box,
  Skeleton,
} from '@mui/material';
import { useGetListingsQuery } from '../listingsApi';
import { ListingCard } from '../components/ListingCard';

export function Component() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching, isError, refetch } = useGetListingsQuery({
    q: q || undefined,
    page,
    size: 12,
  });

  return (
    <Container className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Browse Listings
      </Typography>

      <TextField
        fullWidth
        label="Search listings"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(0);
        }}
        className="mb-6"
      />

      {isLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={280} className="rounded" />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <button onClick={() => refetch()} className="underline">
              Retry
            </button>
          }
        >
          Couldn't load listings. Check your connection and try again.
        </Alert>
      )}

      {!isLoading && !isError && data && data.content.length === 0 && (
        <Alert severity="info">
          No listings match your search. Try a different keyword or clear the search box.
        </Alert>
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <Grid container spacing={3}>
            {data.content.map((listing) => (
              <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>

          {data.totalPages > 1 && (
            <Box className="mt-8 flex justify-center">
              <Pagination
                count={data.totalPages}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
                disabled={isFetching}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}