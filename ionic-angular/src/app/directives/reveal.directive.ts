import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

/**
 * Scroll reveal (fade-in + slide-up) equivalente ao utilitário `.reveal` da
 * versão html-css-js: usa o mesmo IntersectionObserver nativo e as mesmas
 * classes CSS (`.reveal` / `.is-visible`, definidas em global.scss), para
 * que as duas versões do portfólio se comportem da mesma forma ao scroll.
 *
 * Uso: `<h2 appReveal>` ou, para desfasar itens de uma lista,
 * `<div appReveal [appRevealDelay]="$index * 0.1">`.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /** Atraso da transição, em segundos (ex: 0.1 para o 2º item de uma lista). */
  @Input() appRevealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    this.renderer.addClass(element, 'reveal');

    if (this.appRevealDelay) {
      // Renderer2.setStyle não define custom properties CSS sem a flag DashCase
      // (faz `el.style[prop] = value`, que é ignorado para nomes com `--`).
      element.style.setProperty('--reveal-delay', `${this.appRevealDelay}s`);
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.renderer.addClass(element, 'is-visible');
          element.addEventListener(
            'transitionend',
            () => {
              this.renderer.setStyle(element, 'will-change', 'auto');
              // liberta a transição de hover original de .card/.contact-card (que
              // colide em especificidade com .reveal) assim que a entrada termina.
              this.renderer.removeClass(element, 'reveal');
            },
            { once: true },
          );
          this.observer?.unobserve(element);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
