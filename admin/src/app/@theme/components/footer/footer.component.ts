import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Criado por <b><a href="https://wa.me/5562991333856" target="_blank">Vinícius Castro</a></b>
    </span>
  `,
})
export class FooterComponent {
}
