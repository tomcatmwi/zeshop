import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { MomentModule } from 'ngx-moment';

//  Page components
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsEditComponent } from './settings/settings-edit.component';
import { SettingGroupsComponent } from './settinggroups/settinggroups.component';
import { SettingGroupsEditComponent } from './settinggroups/settinggroups-edit.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageFoldersComponent } from './messagefolders/messagefolders.component';
import { MessageFoldersEditComponent } from './messagefolders/messagefolders-edit.component';
import { AutoRepliesComponent } from './autoreplies/autoreplies.component';
import { AutoRepliesEditComponent } from './autoreplies/autoreplies-edit.component';
import { MessageSendComponent } from './messages/message-send.component';

//  Helper components
import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { FooterbarComponent } from './footerbar/footerbar.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { DateTimePickerComponent } from './components/datetimepicker/datetimepicker.component';
import { GoogleMapsComponent } from './components/googlemaps/googlemaps.component';
import { UserSelectComponent } from './components/userselect/userselect.component';
import { ShowMapComponent } from './components/showmap/showmap.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RicheditComponent } from './components/richedit/richedit.component';

//  Services
import { JSONService } from './services/json.service';
import { MD5Service } from './services/md5.service';
import { LoginCheck } from './services/routeguards.service';
import { FormValidators } from './services/formvalidator.service';
import { GoogleMapsService } from './components/googlemaps/googlemaps.service';
import { StorageService } from './services/storage.service';
import { FormatNumberPipe, FormatSecondsPipe, ChopStringPipe } from './pipes/formatter.pipe';

export function loadSettings(storageService: StorageService) {
    return () => storageService.loadSettings();
}

export function loadValues(storageService: StorageService) {
    return () => storageService.loadValues();
}

@NgModule({
    declarations: [
        AppComponent,
        MainmenuComponent,
        FooterbarComponent,
        ConfirmComponent,
        SpinnerComponent,
        PaginatorComponent,
        DateTimePickerComponent,
        GoogleMapsComponent,
        UserSelectComponent,
        ShowMapComponent,
        CheckboxComponent,
        RicheditComponent,

        FormatNumberPipe,
        FormatSecondsPipe,
        ChopStringPipe,

        LoginComponent,
        DashboardComponent,
        SettingsComponent,
        SettingsEditComponent,
        SettingGroupsComponent,
        SettingGroupsEditComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UsersComponent,
        UsersEditComponent,
        MessagesComponent,
        MessageFoldersComponent,
        MessageFoldersEditComponent,
        AutoRepliesComponent,
        AutoRepliesEditComponent,
        MessageSendComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        NgbModule.forRoot(),
        RecaptchaModule.forRoot(),
        MomentModule
    ],
    providers: [
        StorageService,
        JSONService,
        MD5Service,
        FormValidators,
        LoginCheck,
        GoogleMapsService,
        { provide: APP_INITIALIZER, useFactory: loadSettings, deps: [StorageService], multi: true },
        { provide: APP_INITIALIZER, useFactory: loadValues, deps: [StorageService], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
