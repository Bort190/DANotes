import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];


  firestore: Firestore = inject(Firestore);


  unsubTrash;
  unsubNotes;

  constructor() {

    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();

  }



  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id) }
    )
  }

  async updateNote(colId: string, docId: string, item: {}) {
    await updateDoc(this.getSingleDocRef(colId, docId), item).catch(
      (err) => {
        console.error(err);
      }
    ).then()
  }


  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }


  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes')
  }

  getTrashRef() {
    return collection(this.firestore, 'trash')
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

}
