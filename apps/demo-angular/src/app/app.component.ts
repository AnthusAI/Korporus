import {
  Component, OnInit, signal, ViewChild, ElementRef,
  AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadAppModule } from './module-loader';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

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

  @ViewChild('titlebarsSlot') titlebarsSlot?: ElementRef<HTMLDivElement>;
  @ViewChild('mainSlot') mainSlot?: ElementRef<HTMLDivElement>;
  @ViewChild('settingsSlot') settingsSlot?: ElementRef<HTMLDivElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  private resolveRemoteEntry(): string {
    const envValue = '/apps/hello/remoteEntry.js'; // default
    return envValue;
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
      if (this.titlebarsSlot && this.mainSlot && this.settingsSlot) {
        this.slotsMounted = true;
        this.mountSlots();
      }
    }
  }

  private mountSlots(): void {
    this.appendCustomElement(this.titlebarsSlot!, 'hello-app-titlebar');
    this.appendCustomElement(this.mainSlot!, 'hello-app-main');
    this.appendCustomElement(this.settingsSlot!, 'hello-app-settings');
  }

  private appendCustomElement(ref: ElementRef<HTMLDivElement>, tagName: string): void {
    ref.nativeElement.innerHTML = '';
    ref.nativeElement.appendChild(document.createElement(tagName));
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
