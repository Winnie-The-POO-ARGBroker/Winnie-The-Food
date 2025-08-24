import { ApplicationRef, Injectable, Signal, computed, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreloaderService {
  /** visible al iniciar la app */
  private _active = signal(true);
  active: Signal<boolean> = computed(() => this._active());

  show() { this._active.set(true); }
  hide() { this._active.set(false); }

  /** Espera a que todas las imágenes dentro de `root` terminen de cargar */
  async waitForImages(root: ParentNode = document): Promise<void> {
    const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
    const pending = imgs.filter(img => !img.complete);
    if (pending.length === 0) return;

    await Promise.allSettled(
      pending.map(img => {
        if (typeof img.decode === 'function') {
          return img.decode().catch(() => void 0);
        }
        return new Promise<void>(res => {
          img.addEventListener('load', () => res(), { once: true });
          img.addEventListener('error', () => res(), { once: true });
        });
      })
    );
  }
}
