import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillGroup } from '../../models/skill-group.model';
import { SKILL_GROUPS } from '../../data/portfolio-data';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  readonly skillGroups: SkillGroup[] = SKILL_GROUPS;
}
