import { Storage } from '@capacitor/storage';


export interface StorageCacheItem {
  key: string;
  value: any;
  expires: number;
  type: string;
  groupKey: string;
}

export class CacheStorageService {
  constructor( private keyPrefix: string) {}

  public ready() {
    return Storage!==undefined;
  }

  public async set(key: string, value: any) {
    await this.ready();

    return Storage.set({key:this.buildKey(key),value: JSON.stringify(value)});
  }

  public async remove(key: string) {
    await this.ready();

    return Storage.remove({ key:this.buildKey(key)});
  }

  public async get(key: string) {
    await this.ready();

    let value = await Storage.get({key:this.buildKey(key)});
    return !!value ? Object.assign({ key: key },JSON.parse( value.value)) : null;
  }

  public async exists(key: string) {
    await this.ready();

    return !!(await Storage.get({key:this.buildKey(key)}));
  }

  public async all(): Promise<StorageCacheItem[]> {
    await this.ready();

    let items: StorageCacheItem[] = [];
	 const { keys }=await  Storage.keys()
	 keys.forEach(key=>{
		Storage.get({key:key}).then(val=>{
			if (this.isCachedItem(key, val.value)) {
				items.push(Object.assign({ key: this.debuildKey(key) },JSON.parse(val.value)));
			}
		})
	 })	

    return items;
  }

  /**
   * @description Returns whether or not an object is a cached item.
   * @return {boolean}
   */
  private isCachedItem(key: string, item: any): boolean {
    return item && item.expires && item.type && key.startsWith(this.keyPrefix);
  }

  /**
   * Makes sure that the key is prefixed properly
   * @return {string}
   */
  private buildKey(key: string): string {
    if (key.startsWith(this.keyPrefix)) {
      return key;
    }

    return this.keyPrefix + key;
  }

  /**
   * Makes sure that the key isn't prefixed
   * @return {string}
   */
  private debuildKey(key: string): string {
    if (key.startsWith(this.keyPrefix)) {
      return key.substr(this.keyPrefix.length);
    }

    return key;
  }
}
