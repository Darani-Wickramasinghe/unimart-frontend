import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Rating,
} from '@mui/material';
import { useCreateReviewMutation } from '../reviewsApi';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Please select a rating').max(5),
  comment: z.string().trim().max(1000, 'Max 1000 characters').optional(),
});

type ReviewFormInput = z.input<typeof reviewSchema>;
type ReviewFormValues = z.output<typeof reviewSchema>;

export function Component() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [createReview, { isLoading, error }] = useCreateReviewMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    } = useForm<ReviewFormInput, unknown, ReviewFormValues>({
      resolver: zodResolver(reviewSchema),
      defaultValues: { rating: 0, comment: '' },
    });

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await createReview({
        orderId: Number(orderId),
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      navigate('/');
    } catch {
      // error shown below
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      if (error.status === 409) return 'This order already has a review, or is not yet completed.';
      if (error.status === 403) return 'Only the buyer of this order can leave a review.';
      if (error.status === 404) return 'Order not found.';
    }
    return 'Something went wrong. Please try again.';
  };

  const errorMessage = getErrorMessage();

  return (
    <Container className="py-8" maxWidth="sm">
      <Typography variant="h4" component="h1" className="mb-6">
        Leave a Review
      </Typography>

      {errorMessage && (
        <Alert severity="error" className="mb-4">
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <Controller
                  control={control}
                  name="rating"
                  render={({ field }) => (
                    <div>
                      <Typography component="label" className="block mb-1">
                        Rating
                      </Typography>
                      <Rating
                        value={typeof field.value === 'number' ? field.value : 0}
                        onChange={(_event, value) => field.onChange(value ?? 0)}
                        aria-label="Review rating"
                      />
              {errors.rating && (
                <Typography color="error" variant="caption" className="block">
                  {errors.rating.message}
                </Typography>
              )}
            </div>
          )}
        />
        <TextField
          label="Comment"
          multiline
          minRows={4}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          error={!!errors.comment}
          helperText={errors.comment?.message}
          {...register('comment')}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
          {isLoading ? 'Submitting...' : 'Submit review'}
        </Button>
      </Box>
    </Container>
  );
}