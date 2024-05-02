import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteComponent } from './note-list/note/note.component';
import { FormsModule } from '@angular/forms';
import { AddNoteDialogComponent } from './add-note-dialog/add-note-dialog.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NoteListComponent,
    NoteComponent,
    AddNoteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"danotes-d74bd","appId":"1:191506583253:web:c56a23a7f220aeae455c5c","storageBucket":"danotes-d74bd.appspot.com","apiKey":"AIzaSyAHecB7r3CKC6ph9gcGRe73uzz82UHQnPw","authDomain":"danotes-d74bd.firebaseapp.com","messagingSenderId":"191506583253"})),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
