import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent {
  placeholder = input('');
  search = output<string>();
  query = '';

  submitSearch() {
    const value = this.query.trim();
    console.log(`searching for ${value}`);

    this.search.emit(value);
  }
}
