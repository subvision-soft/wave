import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService, ToastTypes } from './toast.service';
import { CompetitorModel } from '../models/competitor.model';
import { UploadTargetModel } from '../models/upload-target.model';
import { CapacitorHttp } from '@capacitor/core';
import { EventModel } from '../models/event.model';

@Injectable()
export class ServerService {
  public connectionStatus: Subject<boolean> = new Subject<boolean>();

  public uri: string = 'http://192.168.1.41:8080/api/competitions/102';

  constructor(private toastService: ToastService) {
    this.connectionStatus.subscribe((status) => {
      if (status) {
        this.toastService.initiate({
          title: 'SERVER.TOASTS.SUCCESS.TITLE',
          content: 'SERVER.TOASTS.SUCCESS.CONTENT',
          show: true,
          type: ToastTypes.SUCCESS,
          duration: 1500,
        });
      } else {
        this.uri = '';
        this.toastService.initiate({
          title: 'SERVER.TOASTS.DISCONNECTED.TITLE',
          content: 'SERVER.TOASTS.DISCONNECTED.CONTENT',
          show: true,
          type: ToastTypes.INFO,
          duration: 1500,
        });
      }
    });
  }

  connect(uri: string) {
    CapacitorHttp.get({
      url: `${uri}/is-wave-db-alive`,
    }).then((res) => {
      this.connectionStatus.next(true);
      this.uri = uri;
    });
  }

  isConnected() {
    return !!this.uri;
  }

  disconnect() {
    this.connectionStatus.next(false);
  }

  getCategories() {
    return fetch(`${this.uri}/categories`);
  }

  getEvents(): Promise<EventModel[]> {
    return new Promise((resolve, reject) => {
      CapacitorHttp.get({
        url: `${this.uri}/events`,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getCompetitors(): Promise<CompetitorModel[]> {
    return new Promise((resolve, reject) => {
      CapacitorHttp.get({
        url: `${this.uri}/competitors`,
      }).then((res) => {
        resolve(res.data);
      });
    });
  }

  postTarget(target: UploadTargetModel) {
    return fetch(`${this.uri}/targets`, {
      method: 'POST',
      body: JSON.stringify(target),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
