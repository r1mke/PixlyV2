import { Component , OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.css'
})
export class SelectFilterComponent implements OnInit {
    countries: any[] | undefined;

    selectedCountry: { name: string, code: string } | undefined

    ngOnInit() {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    }
}
