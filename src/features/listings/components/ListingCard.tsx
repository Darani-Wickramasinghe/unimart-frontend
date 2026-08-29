import { Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Listing } from '../listingTypes';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Typography variant="h6" component="h2">
            {listing.title}
          </Typography>
          <Chip size="small" label={listing.status} />
        </div>
        <Typography color="text.secondary">{listing.categoryName}</Typography>
        <Typography className="line-clamp-3" sx={{ flexGrow: 1 }}>
          {listing.description}
        </Typography>
        <Typography variant="h6">
          LKR {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
        </Typography>
        <Button component={Link} to={`/listings/${listing.id}`} variant="contained">
          View listing
        </Button>
      </CardContent>
    </Card>
  );
}