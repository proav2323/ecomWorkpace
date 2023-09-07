import { Component, Input, OnInit } from '@angular/core';
import { AuthService, User, reviews } from 'ecomLib';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css'],
})
export class ReviewCardComponent implements OnInit {
  @Input() review!: reviews;
  user!: User | null;
  reviewUser!: User;
  reviews: any[] = [];
  constructor(private authService: AuthService) {
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
  }
  ngOnInit() {
    this.reviews = Array(this.review.stars);
    const data = this.authService.getReviewUser(this.review.createdBy);
    data.subscribe((data) => {
      this.reviewUser = data.data;
    });
  }
}
