import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  /** Atraso do scroll reveal (segundos), para desfasar cards no grid. */
  @Input() revealDelay = 0;
}
