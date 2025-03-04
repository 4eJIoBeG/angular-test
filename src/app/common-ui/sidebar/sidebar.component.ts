import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { ProfileService } from '../../data/services/profile.service';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  profileService = inject(ProfileService);

  subscribers$ = this.profileService.getSubscribersShortList(3);

  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
