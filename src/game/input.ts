/**
 * input.ts — typing input for two worlds:
 *  - hardware keyboards (laptop, Clicks Communicator): window keydown, letters only.
 *  - touch phones: a hidden input summons the OS soft keyboard with autocorrect,
 *    autocomplete, spellcheck and predictive text all off; characters arrive via
 *    `input` events (soft keyboards often send no usable keydown).
 * Wrong letters are the game's problem to ignore; this layer just reports them.
 */

export type ControlKey = "start" | "pause" | "mute" | "restart" | "resetBest" | "endless";

export class GameInput {
  onChar: ((c: string) => void) | null = null;
  onControl: ((k: ControlKey) => void) | null = null;
  /** While a race is live, M/R/X are letters to type, not shortcuts. */
  typingActive: () => boolean = () => false;
  private hidden: HTMLInputElement | null = null;
  private disposed = false;

  private readonly keydown = (e: KeyboardEvent) => {
    if (this.disposed) return;
    // When the soft keyboard owns the hidden field, characters arrive via `input`.
    const fromHidden = this.hidden && document.activeElement === this.hidden;
    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.onControl?.("start");
        return;
      case "Escape":
        this.onControl?.("pause");
        return;
      case "Enter":
        this.onControl?.("endless");
        return;
      case "KeyM":
        if (!this.typingActive()) { this.onControl?.("mute"); return; }
        break;
      case "KeyR":
        if (!this.typingActive()) { this.onControl?.("restart"); return; }
        break;
      case "KeyX":
        if (!this.typingActive()) { this.onControl?.("resetBest"); return; }
        break;
    }
    if (fromHidden) return;
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      this.onChar?.(e.key.toLowerCase());
    }
  };

  private readonly pointerdown = (e: PointerEvent) => {
    if (e.pointerType === "touch") this.focusMobile();
  };

  private readonly input = () => {
    if (!this.hidden) return;
    const v = this.hidden.value;
    this.hidden.value = "";
    for (const ch of v) {
      if (/[a-zA-Z]/.test(ch)) this.onChar?.(ch.toLowerCase());
    }
  };

  /** Call once; creates the hidden mobile input. */
  attach(): void {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("pointerdown", this.pointerdown);
    const el = document.createElement("input");
    el.type = "text";
    el.id = "mobile-type-input";
    el.setAttribute("autocorrect", "off");
    el.setAttribute("autocomplete", "off");
    el.setAttribute("autocapitalize", "none");
    el.setAttribute("spellcheck", "false");
    el.setAttribute("enterkeyhint", "go");
    el.setAttribute("aria-label", "typing input");
    document.body.appendChild(el);
    el.addEventListener("input", this.input);
    this.hidden = el;
  }

  /** Summon the soft keyboard (must be called inside a touch gesture). */
  focusMobile(): void {
    this.hidden?.focus({ preventScroll: true });
  }

  blurMobile(): void {
    this.hidden?.blur();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("pointerdown", this.pointerdown);
    if (this.hidden) {
      this.hidden.removeEventListener("input", this.input);
      this.hidden.remove();
      this.hidden = null;
    }
  }
}
