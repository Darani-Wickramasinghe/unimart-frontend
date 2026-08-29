export interface Review {
  id: number;
  orderId: number;
  reviewerId: number;
  reviewerName: string;
  revieweeId: number;
  revieweeName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateInput {
  orderId: number;
  rating: number;
  comment?: string;
}

export interface ReviewUpdateInput {
  rating: number;
  comment?: string;
}