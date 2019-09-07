describe('visual testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('should show the landing page', () => {
    cy.eyesOpen({
      appName: 'React Split Pane',
      testName: 'should show the landing page',
      browser: [{ width: 1024, height: 768, name: 'chrome' }],
    });
    cy.eyesCheckWindow('Landing page');
  });

  it('should choose basic horizontal', () => {
    cy.eyesOpen({
      appName: 'React Split Pane',
      testName: 'should choose basic horizontal',
      browser: [{ width: 1024, height: 768, name: 'chrome' }],
    });
    cy.get('[href="#/basic-horizontal"]').click();
    cy.wait(100);
    cy.eyesCheckWindow('Basic Horizontal');
  });

  it('should be able to move the horizontal bar', () => {
    cy.eyesOpen({
      appName: 'React Split Pane',
      testName: 'should be able to move the horizontal bar',
      browser: [{ width: 1024, height: 768, name: 'chrome' }],
    });
    cy.get('[href="#/basic-horizontal"]').click();
    cy.wait(100);
    // cy.get('.Pane1')
    cy.get('.Resizer').click();
  });

  it('should choose basic vertical', () => {
    cy.eyesOpen({
      appName: 'React Split Pane',
      testName: 'should choose basic vertical',
      browser: [{ width: 1024, height: 768, name: 'chrome' }],
    });
    cy.get('[href="#/basic-vertical"]');
    cy.wait(100);
    cy.eyesCheckWindow('Basic Vertical');
  });

  it('should be able to move the vertical bar', () => {
    cy.eyesOpen({
      appName: 'React Split Pane',
      testName: 'should be able to move the vertical bar',
      browser: [{ width: 1024, height: 768, name: 'chrome' }],
    });
    cy.get('[href="#/basic-vertical"]');
    cy.wait(100);
    cy.get('.Resizer').click();
    cy.eyesCheckWindow('Basic Vertical');
  });
});
