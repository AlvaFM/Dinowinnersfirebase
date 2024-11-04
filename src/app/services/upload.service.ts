import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File, path: string): Promise<string> {
    const filePath = `${path}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const downloadURL = await firstValueFrom(fileRef.getDownloadURL());
            resolve(downloadURL); 
          } catch (error) {
            reject(error);
          }
        })
      ).toPromise(); 
    });
  }
}