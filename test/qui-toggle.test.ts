import { html, fixture, expect } from "@open-wc/testing";

import { QuiToggle } from "../src/shared/ui/toggle/toggle";
import "../src/shared/ui/toggle/toggle";

describe("QuiToggle Component", () => {
  let element: QuiToggle;

  beforeEach(async () => {
    element = await fixture(html`<qui-toggle></qui-toggle>`);
  });

  it('has a default label "Toggle"', () => {
    expect(element.label).to.equal("Toggle");
  });

  it("changes label when attribute changes", async () => {
    element.setAttribute("label", "New label");
    await element.updateComplete;
    expect(element.label).to.equal("New label");
  });
});
