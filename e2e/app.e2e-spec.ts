import { AppPage } from './app.po';

describe('ngx-svg App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Should compile app', () => {
    page.navigateTo();
  });
});
