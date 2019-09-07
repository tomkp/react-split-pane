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

  describe('basic horizontal', () => {
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

    it('should be able to interact with the horizontal bar', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should be able to move the horizontal bar',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-horizontal"]').click();
      cy.wait(100);
      cy.get('.Pane1 > div').should('contain', 'default min: 50px');
      cy.get('.Pane1')
        .should('be.visible')
        .and('have.css', 'height', '50px');
      cy.get('.Resizer').click();
      cy.eyesCheckWindow('Basic Horizontal');
    });
  });

  describe('basic vertical', () => {
    it('should choose basic vertical', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should choose basic vertical',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-vertical"]').click();
      cy.wait(100);
      cy.eyesCheckWindow('Basic Vertical');
    });

    it('should be able to interact with the vertical bar', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should be able to move the vertical bar',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-vertical"]').click();
      cy.wait(100);
      cy.get('.Pane1')
        .should('be.visible')
        .and('have.css', 'width', '50px');
      cy.get('.Pane1 > div').should('contain', 'default min: 50px');
      cy.get('.Resizer').click();
      cy.eyesCheckWindow('Basic Vertical');
    });
  });

  describe('basics step', () => {
    it('should choose basic step', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should choose basic step',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-step"]').click();
      cy.wait(100);
      cy.eyesCheckWindow('Basic Step');
    });

    it('should be able to interact with the step bar', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should be able to move the step bar',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-step"]').click();
      cy.wait(100);
      cy.get('.Pane1')
        .should('be.visible')
        .and('have.css', 'width', '200px');
      cy.get('.Pane1 > div').should(
        'contain',
        'min: 200px, max: 1000px, step size: 50px'
      );
      cy.eyesCheckWindow('Basic Step');
    });
  });

  describe('Basic Nested', () => {
    it('should click basic nested', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should be able to move the step bar',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-nested"]').click();
      cy.wait(100);
      cy.eyesCheckWindow('Basic Nested');
    });

    it('should be able to interact with the bars', () => {
      cy.eyesOpen({
        appName: 'React Split Pane',
        testName: 'should be able to move the step bar',
        browser: [{ width: 1024, height: 768, name: 'chrome' }],
      });
      cy.get('[href="#/basic-nested"]').click();
      cy.wait(100);
      cy.eyesCheckWindow('Basic Nested');
    });
  });
});
