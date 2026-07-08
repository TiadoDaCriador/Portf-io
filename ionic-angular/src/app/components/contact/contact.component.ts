import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface ContactLink {
  label: string;
  value: string;
  href: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  // Substituir pelos teus dados reais antes de publicar
  readonly contactLinks: ContactLink[] = [
    { label: 'Email', value: 'tiago.silva.dev@email.com', href: 'mailto:tiago.silva.dev@email.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/tiago-silva-dev', href: 'https://linkedin.com/in/tiago-silva-dev' },
    { label: 'GitHub', value: 'github.com/tiagosilva-dev', href: 'https://github.com/tiagosilva-dev' },
  ];
}
