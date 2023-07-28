import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { DbState } from '../../lib/models';
import { SQLiteService } from './sqlite.service';

@Injectable()
export class DbService {
  db: SQLiteDBConnection | null = null;

  state = new BehaviorSubject<DbState>({
    ready: false,
    error: false,
    loading: true,
    state: 'loading',
  });

  constructor(private SqliteService: SQLiteService) {}

  async initializePlugin(): Promise<void> {
    this.SqliteService.initializePlugin().then((ret) => {
      Promise.resolve(ret);
    });
  }

  async init(): Promise<void> {
    try {
      const db = await this.SqliteService.createConnection(
        'db',
        false,
        'no-encryption',
        1
      );
      await db.open();
      this.db = db;
      this.state.next(this.newState('ready'));
      debugger;
    } catch (err) {
      this.state.next(this.newState('error'));
      debugger;
    }
  }

  /**
   * generates a new state object
   * @param change - the new state of the module
   */
  private newState(change: 'loading' | 'ready' | 'error'): DbState {
    const newStateObj: DbState = {
      ready: false,
      loading: false,
      error: false,
      state: '',
    };
    Object.keys(newStateObj).forEach((key) => {
      if (key !== 'state') {
        if (key === change) {
          newStateObj[key] = true;
          newStateObj.state = key;
        }
        // else {
        //   newStateObj[key] = false;
        // }
      }
    });
    return newStateObj;
  }
}
