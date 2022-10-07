import { Logger } from "winston";

export class Question {
  readonly _logger: Logger;
  private _text: string;
  private _options: Map<string, boolean> = new Map<string, boolean>(); // text, complete_if_selected
  readonly _option_count: number;
  readonly _right_option: number = 0; // default to first for now
  readonly _terminal_index: number;

  constructor(logger: Logger, text: string, options: []) {
    this._logger = logger;
    this._text = text;
    let count = 0;
    let terminal_index: number = -1; // not best practice
    options.forEach(option => {
      //
      if (option["complete_if_selected"]) {
        this._options.set(option["text"], option["complete_if_selected"]);
        terminal_index = count;
      } else {
        this._options.set(option["text"], false);
      }
      count += 1;
    });
    this._terminal_index = terminal_index;
    this._option_count = count;
  }

  get text(): string {
    return this._text;
  }
  get option_count(): number {
    return this._option_count;
  }

  tostring() {
    this._logger.info(this._text);
    this._logger.info("Options");
    let index = 0;
    this._options.forEach((key, value) => {
      this._logger.info("[" + index + "] - " + value);
      index += 1;
    });
  }
}
