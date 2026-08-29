import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Rating,
  TextField,
} from '@mui/material';
import { useGetListingQuery, useArchiveListingMutation } from '../listingsApi';
import {
  useGetListingReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../../reviews/reviewsApi';
import { useAppSelector } from '../../../app/hooks';
import type { Review } from '../../reviews/reviewTypes';

function ReviewItem({ review }: { review: Review }) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isReviewOwner = currentUser?.id === review.reviewerId;

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? '');

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const handleSave = async () => {
    try {
      await updateReview({ id: review.id, body: { rating, comment } }).unwrap();
      setIsEditing(false);
    } catch {
      alert('Failed to update review.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    try {
      await deleteReview(review.id).unwrap();
    } catch {
      alert('Failed to delete review.');
    }
  };

  if (isEditing) {
    return (
      <Box className="mb-4 pb-4 border-b">
        <Rating
          value={rating}
          onChange={(_e, value) => setRating(value ?? 0)}
          className="mb-2"
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          className="mb-2"
        />
        <Box className="flex gap-2">
          <Button size="small" variant="contained" onClick={handleSave} disabled={isUpdating}>
            Save
          </Button>
          <Button size="small" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mb-4 pb-4 border-b">
      <div className="flex items-center gap-2 mb-1">
        <Typography variant="subtitle2">{review.reviewerName}</Typography>
        <Rating value={review.rating} readOnly size="small" />
      </div>
      {review.comment && <Typography>{review.comment}</Typography>}
      {isReviewOwner && (
        <Box className="flex gap-2 mt-2">
          <Button size="small" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export function Component() {
  const { id } = useParams();
  const listingId = Number(id);
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: listing, isLoading, isError, refetch } = useGetListingQuery(listingId);
  const [archiveListing, { isLoading: isArchiving }] = useArchiveListingMutation();
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetListingReviewsQuery(listingId);

  const isOwner = Boolean(currentUser && listing && currentUser.id === listing.sellerId);

  const handleArchive = async () => {
    if (!listing) return;
    if (!confirm('Archive this listing? This cannot be undone.')) return;
    try {
      await archiveListing(listing.id).unwrap();
      navigate('/');
    } catch {
      alert('Failed to archive listing. You may not have permission.');
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !listing) {
    return (
      <Container className="py-8">
        <Alert
          severity="error"
          action={
            <button onClick={() => refetch()} className="underline">
              Retry
            </button>
          }
        >
          This listing could not be found or is no longer available.
        </Alert>
        <Button component={Link} to="/" className="mt-4">
          Back to listings
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-8" maxWidth="md">
      <div className="flex items-start justify-between gap-4 mb-4">
        <Typography variant="h4" component="h1">
          {listing.title}
        </Typography>
        <Chip label={listing.status} />
      </div>

      <Typography color="text.secondary" className="mb-2">
        {listing.categoryName} · Sold by {listing.sellerName}
      </Typography>

      <Typography variant="h5" className="mb-4">
        LKR {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
      </Typography>

      <Typography className="mb-6 whitespace-pre-wrap">{listing.description}</Typography>

      {isOwner && (
        <Box className="flex gap-2 mb-8">
          <Button component={Link} to={`/listings/${listing.id}/edit`} variant="outlined">
            Edit
          </Button>
          <Button
            onClick={handleArchive}
            variant="outlined"
            color="error"
            disabled={isArchiving || listing.status === 'ARCHIVED'}
          >
            {isArchiving ? 'Archiving...' : 'Archive'}
          </Button>
        </Box>
      )}

      <Divider className="mb-6" />

      <Typography variant="h5" className="mb-4">
        Reviews
      </Typography>

      {isLoadingReviews && <CircularProgress size={24} />}

      {!isLoadingReviews && (!reviewsData || reviewsData.content.length === 0) && (
        <Typography color="text.secondary">No reviews yet for this listing.</Typography>
      )}

      {reviewsData?.content.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </Container>
  );
}