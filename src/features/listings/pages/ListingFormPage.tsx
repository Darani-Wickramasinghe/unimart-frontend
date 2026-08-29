import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  useCreateListingMutation,
  useUpdateListingMutation,
  useGetListingQuery,
} from '../listingsApi';
import { useGetCategoriesQuery } from '../../categories/categoriesApi';

const listingSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Max 160 characters'),
  description: z.string().trim().min(1, 'Description is required').max(5000, 'Max 5000 characters'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  categoryId: z.coerce.number().int().positive('Select a category'),
});

type ListingFormInput = z.input<typeof listingSchema>;
type ListingFormValues = z.output<typeof listingSchema>;

export function Component() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const listingId = id ? Number(id) : undefined;

  const { data: existingListing, isLoading: isLoadingListing } = useGetListingQuery(
    listingId!,
    { skip: !isEditMode }
  );
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const [createListing, { isLoading: isCreating, error: createError }] =
    useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating, error: updateError }] =
    useUpdateListingMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    } = useForm<ListingFormInput, unknown, ListingFormValues>({
      resolver: zodResolver(listingSchema),
      defaultValues: { title: '', description: '', price: 0, categoryId: 0 },
    });

  useEffect(() => {
    if (existingListing) {
      reset({
        title: existingListing.title,
        description: existingListing.description,
        price: existingListing.price,
        categoryId: existingListing.categoryId,
      });
    }
  }, [existingListing, reset]);

  const onSubmit = async (values: ListingFormValues) => {
    try {
      if (isEditMode && listingId) {
        const result = await updateListing({ id: listingId, body: values }).unwrap();
        navigate(`/listings/${result.id}`);
      } else {
        const result = await createListing(values).unwrap();
        navigate(`/listings/${result.id}`);
      }
    } catch {
      // error already captured by RTK Query's error state below
    }
  };

  if (isEditMode && isLoadingListing) {
    return (
      <Container className="py-8 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  const submitError = createError || updateError;
  const isBusy = isSubmitting || isCreating || isUpdating;

  return (
    <Container className="py-8" maxWidth="sm">
      <Typography variant="h4" component="h1" className="mb-6">
        {isEditMode ? 'Edit Listing' : 'Create Listing'}
      </Typography>

      {submitError && (
        <Alert severity="error" className="mb-4">
          {'status' in submitError && submitError.status === 403
            ? "You don't have permission to edit this listing."
            : "Something went wrong. Please check your input and try again."}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <TextField
          label="Title"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
        />
        <TextField
          label="Description"
          multiline
          minRows={5}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />
        <TextField
          label="Price (LKR)"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price')}
        />
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <TextField
              select
              label="Category"
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              disabled={isLoadingCategories}
              {...field}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" disabled={isBusy}>
          {isBusy ? 'Saving...' : 'Save listing'}
        </Button>
      </Box>
    </Container>
  );
}