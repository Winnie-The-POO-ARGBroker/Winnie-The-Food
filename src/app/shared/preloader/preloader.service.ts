import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreloaderService {
  private _active = signal(false);
  active: Signal<boolean> = computed(() => this._active());

  // contadores
  private _pendingHttp = signal(0);
  private _routeBusy   = signal(false);
  get pendingHttp() { return this._pendingHttp(); }

  private _hideScheduled = false;

  // ---- toggles base
  show() { this._active.set(true); }
  hide() { this._active.set(false); }

  // ---- HTTP (interceptor ya lo llama)
  httpStart() {
    this._pendingHttp.update(n => n + 1);
    this.show();
  }
  httpEnd() {
    this._pendingHttp.update(n => Math.max(0, n - 1));
    if (!this._routeBusy() && this._pendingHttp() === 0) this.settleAndHide();
  }

  // ---- ROUTER (nuevo)
  routeStart() {
    this._routeBusy.set(true);
    this.show();
  } 
  routeEnd() {
    this._routeBusy.set(false);
    if (this._pendingHttp() === 0) this.settleAndHide();
  }

  // Espera frame + imágenes antes de ocultar
  private async settleAndHide() {
    if (this._hideScheduled) return;
    this._hideScheduled = true;
    await Promise.resolve();
    await new Promise<void>(r => requestAnimationFrame(() => r()));
    await this.waitForImages(document, 5000);
    this.hide();
    this._hideScheduled = false;
  }

  async waitForImages(root: ParentNode | null = document, timeoutMs = 4000): Promise<void> {
    const scope: Document | Element =
      (root && 'querySelectorAll' in root ? (root as Document | Element) : document);
    const imgs = Array.from(scope.querySelectorAll('img')) as HTMLImageElement[];
    const pending = imgs.filter(img => !img.complete);
    if (pending.length === 0) return;

    const waits = pending.map(img =>
      typeof img.decode === 'function'
        ? img.decode().catch(() => void 0)
        : new Promise<void>(res => {
            img.addEventListener('load',  () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          })
    );
    const timeout = new Promise<void>(res => setTimeout(res, timeoutMs));
    await Promise.race([Promise.allSettled(waits).then(() => void 0), timeout]);
  }
}
