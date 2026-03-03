import {
  Component, OnInit, signal, ViewChild, ElementRef,
  AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadAppModule } from './module-loader';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';
const DEFAULT_REMOTE_ENTRY =
  'https://awdmyggmnm.us-east-1.awsapprunner.com/apps/hello/mf-manifest.json';
const LOCAL_REMOTE_ENTRY = '/apps/hello/mf-manifest.json';

type AngularImportMetaEnv = {
  KORPORUS_REMOTE_ENTRY?: string;
  VITE_KORPORUS_REMOTE_ENTRY?: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewChecked {
  loadState = signal<LoadState>('idle');
  errorMessage = signal<string | null>(null);
  private slotsMounted = false;

  readonly remoteEntry: string = this.resolveRemoteEntry();

  @ViewChild('menubarSlot') menubarSlot?: ElementRef<HTMLDivElement>;
  @ViewChild('mainSlot') mainSlot?: ElementRef<HTMLDivElement>;
  @ViewChild('settingsSlot') settingsSlot?: ElementRef<HTMLDivElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  private resolveRemoteEntry(): string {
    const importMetaEnv = (import.meta as ImportMeta & { env?: AngularImportMetaEnv }).env;
    const windowConfig = window as Window & {
      KORPORUS_REMOTE_ENTRY?: string;
      __KORPORUS_REMOTE_ENTRY__?: string;
    };
    const isLocalHost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    return (
      windowConfig.__KORPORUS_REMOTE_ENTRY__ ??
      windowConfig.KORPORUS_REMOTE_ENTRY ??
      importMetaEnv?.KORPORUS_REMOTE_ENTRY ??
      importMetaEnv?.VITE_KORPORUS_REMOTE_ENTRY ??
      (isLocalHost ? LOCAL_REMOTE_ENTRY : DEFAULT_REMOTE_ENTRY)
    );
  }

  ngOnInit(): void {
    this.loadModule();
  }

  async loadModule(): Promise<void> {
    this.slotsMounted = false;
    this.loadState.set('loading');
    try {
      const resolvedEntry = this.remoteEntry.startsWith('http://') || this.remoteEntry.startsWith('https://')
        ? this.remoteEntry
        : `${window.location.origin}${this.remoteEntry}`;
      await loadAppModule('hello_app', resolvedEntry);
      this.loadState.set('loaded');
      this.cdr.detectChanges();
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Unknown error');
      this.loadState.set('error');
    }
  }

  ngAfterViewChecked(): void {
    if (this.loadState() === 'loaded' && !this.slotsMounted) {
      if (this.menubarSlot && this.mainSlot && this.settingsSlot) {
        this.slotsMounted = true;
        this.mountSlots();
      }
    }
  }

  private mountSlots(): void {
    const titlebarTag = customElements.get('hello-app-titlebar')
      ? 'hello-app-titlebar'
      : 'hello-app-menubar';
    this.appendCustomElement(this.menubarSlot!, titlebarTag);
    this.appendCustomElement(this.mainSlot!, 'hello-app-main');
    this.appendCustomElement(this.settingsSlot!, 'hello-app-settings');
  }

  private appendCustomElement(ref: ElementRef<HTMLDivElement>, tagName: string): void {
    ref.nativeElement.innerHTML = '';
    const el = document.createElement(tagName) as HTMLElement;
    el.style.display = 'block';
    el.style.width = '100%';
    ref.nativeElement.appendChild(el);
  }

  saveSettings(): void {
    const settingsEl = this.settingsSlot?.nativeElement.querySelector('hello-app-settings');
    settingsEl?.dispatchEvent(
      new CustomEvent('korporus:settings:save', { bubbles: true, composed: true }),
    );
  }

  retry(): void {
    this.slotsMounted = false;
    this.errorMessage.set(null);
    this.loadModule();
  }

  get isLoaded(): boolean { return this.loadState() === 'loaded'; }
  get isLoading(): boolean { return this.loadState() === 'loading'; }
  get isError(): boolean { return this.loadState() === 'error'; }
}
