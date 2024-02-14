import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class DOMHelperRoutines<T> {
  private fixture: ComponentFixture<T>;
  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  queryTestId(id: string) {
    const queryString = `[data-testid = "{$id}"]`;
    return this.fixture.debugElement.query(By.css(queryString));
  }

  queryFirst(tagName: string) {
    const element = this.fixture.debugElement.query(By.css(tagName));
    if (element) {
      return element.nativeElement.textContent;
    } else {
      return '';
    }
  }

  queryAll(tagName: string) {
    return this.fixture.debugElement.queryAll(By.css(tagName));
  }

  queryWithTextCount(tagName: string, text: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.filter((element) => element.nativeElement.textContent === text).length;
  }

  queryAllCount(tagName: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.length;
  }

  click(buttonText: string) {
    this.queryAll('button').forEach((button) => {
      const buttonElement: HTMLButtonElement = button.nativeElement;
      if (buttonElement.textContent === buttonText) {
        buttonElement.click();
      }
    });
  }
}
