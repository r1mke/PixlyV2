import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../core/services/stripe.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 text-center">
      <h2>Thank you! Processing your download…</h2>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stripe = inject(StripeService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    const pid = Number(this.route.snapshot.queryParamMap.get('pid'));
    if (!pid) {
      this.toast.error('Photo ID is missing.');
      this.router.navigateByUrl('/');
      return;
    }

    const sid = this.route.snapshot.queryParamMap.get('sid') ?? '';
    const guardKey = `dl_${sid}`;
    if (sid && sessionStorage.getItem(guardKey)) {
      this.router.navigateByUrl('/');
      return;
    }

    this.stripe.downloadPhoto(pid).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photo-${pid}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        this.toast.success('Your photo is downloading.');
        if (sid) sessionStorage.setItem(guardKey, '1');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.toast.error('Failed to download photo.');
        this.router.navigateByUrl('/');
      }
    });
  }
}
