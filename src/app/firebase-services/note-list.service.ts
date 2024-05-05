import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, limit, query, orderBy, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }



  async addNote(item: Note, colId: 'notes' | 'trash') {
    let colRef
    if (colId == 'notes') {
      colRef = this.getNotesRef();
    }
    else {
      colRef = this.getTrashRef();
    }
    await addDoc(colRef, item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id) }
    )
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {
          console.error(err);
        })
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }


  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.log(err); }
    )
  }


  subNotesList() {
    const q = query(this.getNotesRef(), limit(100))
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {this.normalNotes.push(this.setNoteObject(element.data(), element.id)); });
      list.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log("New Note: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified Note: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed Note: ", change.doc.data());
        }
      });
    
    })
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(4))
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
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
