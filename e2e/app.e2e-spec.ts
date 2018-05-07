import { ToptalPage } from './app.po';

describe('toptal App', () => {
  let page: ToptalPage;

  beforeEach(() => {
    page = new ToptalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
