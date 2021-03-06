import { RouterModule, Routes } from '@angular/router';
import { LoginCheck } from './services/routeguards.service';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsEditComponent } from './settings/settings-edit.component';
import { SettingGroupsComponent } from './settinggroups/settinggroups.component';
import { SettingGroupsEditComponent } from './settinggroups/settinggroups-edit.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageFoldersComponent } from './messagefolders/messagefolders.component';
import { MessageFoldersEditComponent } from './messagefolders/messagefolders-edit.component';
import { MessageSendComponent } from './messages/message-send.component';
import { AutoRepliesComponent } from './autoreplies/autoreplies.component';
import { AutoRepliesEditComponent } from './autoreplies/autoreplies-edit.component';

export const routing = RouterModule.forRoot([

//  unprotected pages

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'forgotpsw', component: ForgotPasswordComponent, pathMatch: 'full' },
    { path: 'resetpsw/:resetCode', component: ResetPasswordComponent, pathMatch: 'full' },

//  protected pages

    { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settings', component: SettingsComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settings-edit/:id', component: SettingsEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settings-edit', component: SettingsEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settinggroups', component: SettingGroupsComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settinggroups_edit/:id', component: SettingGroupsEditComponent, canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'settinggroups_edit', component: SettingGroupsEditComponent, canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'users-edit', component: UsersEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'users-edit/:id', component: UsersEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'messages', component: MessagesComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'messagefolders', component: MessageFoldersComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'messagefolders-edit/:id', component: MessageFoldersEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'messagefolders-edit', component: MessageFoldersEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'messagesend', component: MessageSendComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'autoreplies/:id', component: AutoRepliesComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'autoreplies', component: AutoRepliesComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'autoreplies-edit/:id', component: AutoRepliesEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    { path: 'autoreplies-edit', component: AutoRepliesEditComponent, pathMatch: 'full', canActivate: [LoginCheck], data: { userLevel: 2 } },
    
//  all the rest
        
    { path: '**', redirectTo: 'dashboard' }
            
])
