import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGetListingsQuery, useArchiveListingMutation } from '../listingsApi';
import { useAppSelector } from '../../../app/hooks';

export function Component() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetListingsQuery({ size: 50 });
  const [archiveListing, { isLoading: isArchiving }] = useArchiveListingMutation();

  const myListings = data?.content.filter((l) => l.sellerId === currentUser?.id) ?? [];

  const handleArchive = async (id: number) => {
    if (!confirm('Archive this listing?')) return;
    try {
      await archiveListing(id).unwrap();
    } catch {
      alert('Failed to archive listing.');
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-8">
        <Alert severity="error">Couldn't load your listings. Try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        My Listings
      </Typography>

      {myListings.length === 0 ? (
        <Alert severity="info">
          You haven't created any listings yet.{' '}
          <Link to="/listings/new">Create your first listing</Link>.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>LKR {listing.price.toLocaleString('en-LK')}</TableCell>
                  <TableCell>
                    <Chip size="small" label={listing.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      to={`/listings/${listing.id}/edit`}
                      size="small"
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      disabled={isArchiving || listing.status === 'ARCHIVED'}
                      onClick={() => handleArchive(listing.id)}
                    >
                      Archive
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}