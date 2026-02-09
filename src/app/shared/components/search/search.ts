import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent {
  searchPlaceholder = input('');
  search = output<string>();
  query = '';

  submitSearch() {
    const value = this.query.trim();
    this.search.emit(value);
  }
}
